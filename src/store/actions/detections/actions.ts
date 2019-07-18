import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { EyeSide } from '../../../AppConstants';
import {
    IDetections,
    IObjectDetector,
    ISelections,
} from '../../../models/objectDetection';
import select, {
    calculateColourMatch,
    closerToColour,
    closerVerticallyTo,
    leftOf,
} from '../../../utils/objectSelection/select';
import { calculateNormalisedPos } from '../../../utils/objectTracking/calculateFocus';
import { ITargets } from '../../../utils/types';
import { getImageDataFromVideos } from '../../../utils/utils';
import { IRootStore } from '../../reducers/rootReducer';
import { getTargets } from '../../selectors/detectionSelectors';
import { getVideos } from '../../selectors/videoSelectors';
import { setImageDataAction } from '../video/actions';
import {
    ISetDetectionsAction,
    ISetModelAction,
    ISetOpenAction,
    ISetSelectionsAction,
    ISetTargetAction,
    SET_DETECTIONS,
    SET_MODEL,
    SET_OPEN,
    SET_SELECTIONS,
    SET_TARGET,
} from './types';

export function setModel(model: IObjectDetector): ISetModelAction {
    return {
        type: SET_MODEL,
        payload: model,
    };
}

export function loadModel(init: () => Promise<IObjectDetector>) {
    return async (dispatch: ThunkDispatch<IRootStore, void, Action>) => {
        const model = await init();
        dispatch(setModel(model));
        dispatch(restartDetection());
    };
}

export function restartDetection() {
    return (
        dispatch: ThunkDispatch<IRootStore, void, Action>,
        getState: () => IRootStore,
    ) => {
        const state = getState();
        clearInterval(state.detectionStore.detectionInterval);
        const id = setInterval(
            () => dispatch(handleDetection()),
            1000 / state.configStore.config.fps,
        );
        dispatch({ type: 'SET_INTERVAL', payload: id });
    };
}

export function handleDetection() {
    return async (
        dispatch: ThunkDispatch<IRootStore, void, Action>,
        getState: () => IRootStore,
    ) => {
        const state = getState();
        const videos = getVideos(state);
        const model = state.detectionStore.model;
        const imgData = state.videoStore.images[EyeSide.LEFT];

        if (!videos[0] || !model) {
            return;
        }

        const images = getImageDataFromVideos(videos);
        dispatch(setImageDataAction(images));

        if (images[EyeSide.LEFT]) {
            const previousTargets = getTargets(state);
            const leftEyeDetections = await model.detect(images[EyeSide.LEFT]!);
            const avgColour = calculateColourMatch(
                imgData,
                previousTargets.left,
            );
            const leftEyeSelection = select(
                leftEyeDetections,
                closerToColour(imgData, avgColour),
            );

            if (leftEyeSelection) {
                const leftTarget = calculateNormalisedPos(
                    leftEyeSelection,
                    images[EyeSide.LEFT].width,
                    images[EyeSide.LEFT].height,
                );

                let rightEyeDetections = null;
                let rightEyeSelection = null;
                let rightTarget = null;
                if (images[EyeSide.RIGHT]) {
                    rightEyeDetections = await model.detect(
                        images[EyeSide.RIGHT],
                    );
                    if (previousTargets.right) {
                        rightEyeSelection = select(
                            rightEyeDetections,
                            closerVerticallyTo(leftEyeSelection[1]),
                            leftOf(leftEyeSelection[0]),
                        );
                    }
                    if (rightEyeSelection) {
                        rightTarget = calculateNormalisedPos(
                            rightEyeSelection,
                            images[EyeSide.RIGHT].width,
                            images[EyeSide.RIGHT].height,
                        );
                        rightTarget.y = leftTarget.y =
                            (rightTarget.y + leftTarget.y) / 2;
                    }
                }
                const newTargets = {
                    left: leftTarget,
                    right: rightTarget,
                };
                dispatch(setTarget(newTargets));
                dispatch(
                    setDetections({
                        left: leftEyeDetections,
                        right: rightEyeDetections,
                    }),
                );
                dispatch(
                    setSelections({
                        left: leftEyeSelection,
                        right:
                            rightEyeSelection === undefined
                                ? null
                                : rightEyeSelection,
                    }),
                );
            } else {
                dispatch(setDetections({ left: [], right: [] }));
            }
        }
    };
}

export function setTarget(target: ITargets): ISetTargetAction {
    return {
        type: SET_TARGET,
        payload: target,
    };
}

export function setDetections(detections: IDetections): ISetDetectionsAction {
    return {
        type: SET_DETECTIONS,
        payload: detections,
    };
}

export function setSelections(selections: ISelections): ISetSelectionsAction {
    return {
        type: SET_SELECTIONS,
        payload: selections,
    };
}

export function setOpen(openCoefficient: number): ISetOpenAction {
    return {
        type: SET_OPEN,
        payload: openCoefficient,
    };
}
