import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { eyelidPosition, maxMoveWithoutBlink } from '../../../AppConstants';
import {
    IDetections,
    IObjectDetector,
    ISelections,
} from '../../../models/objectDetection';
import select, {
    closerTo,
    closerVerticallyTo,
    leftOf,
} from '../../../utils/objectSelection/select';
import { calculateNormalisedPos } from '../../../utils/objectTracking/calculateFocus';
import { ITargets } from '../../../utils/types';
import { getLargerDistance } from '../../../utils/utils';
import { IRootStore } from '../../reducers/rootReducer';
import { getTargets } from '../../selectors/detectionSelectors';
import { getVideos } from '../../selectors/videoSelectors';
import {
    ISetBrightAction,
    ISetDetectionsAction,
    ISetDilationAction,
    ISetLeftAction,
    ISetModelAction,
    ISetOpenAction,
    ISetPersonAction,
    ISetSelectionsAction,
    ISetSquintAction,
    ISetTargetAction,
    SET_BRIGHT,
    SET_DETECTIONS,
    SET_DILATION,
    SET_LEFT,
    SET_MODEL,
    SET_OPEN,
    SET_PERSON,
    SET_SELECTIONS,
    SET_SQUINT,
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
        const images = getVideos(state);
        const model = state.detectionStore.model;

        if (!images[0] || !model) {
            return;
        }
        const leftImage = images[0]!;

        const previousTargets = getTargets(state);
        const leftEyeDetections = await model.detect(leftImage);
        const leftEyeSelection = select(
            leftEyeDetections,
            closerTo(previousTargets.left),
        );

        if (leftEyeSelection) {
            const leftTarget = calculateNormalisedPos(
                leftEyeSelection,
                leftImage.width,
                leftImage.height,
            );

            let rightEyeDetections = null;
            let rightEyeSelection = null;
            let rightTarget = null;
            if (images[1]) {
                const rightImage = images[1]!;
                rightEyeDetections = await model.detect(rightImage);
                rightEyeSelection = select(
                    rightEyeDetections,
                    closerVerticallyTo(leftEyeSelection[1]),
                    leftOf(leftEyeSelection[0]),
                );
                if (rightEyeSelection) {
                    rightTarget = calculateNormalisedPos(
                        rightEyeSelection,
                        rightImage.width,
                        rightImage.height,
                    );
                    rightTarget.y = leftTarget.y =
                        (rightTarget.y + leftTarget.y) / 2;
                }
            }
            const newTargets = {
                left: leftTarget,
                right: rightTarget,
            };
            const leftEyeDist = getLargerDistance(
                previousTargets.left,
                newTargets.left,
            );

            if (leftEyeDist > maxMoveWithoutBlink) {
                dispatch(setOpen(eyelidPosition.CLOSED));
            }

            if (previousTargets.right && newTargets.right) {
                const rightEyeDist = getLargerDistance(
                    previousTargets.right,
                    newTargets.right,
                );

                if (rightEyeDist > maxMoveWithoutBlink) {
                    dispatch(setOpen(eyelidPosition.CLOSED));
                }
            }

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

export function setLeft(left: boolean): ISetLeftAction {
    return {
        type: SET_LEFT,
        payload: left,
    };
}

export function setDilation(dilation: number): ISetDilationAction {
    return {
        type: SET_DILATION,
        payload: dilation,
    };
}

export function setOpen(openCoefficient: number): ISetOpenAction {
    return {
        type: SET_OPEN,
        payload: openCoefficient,
    };
}

export function setDetected(person: boolean): ISetPersonAction {
    return {
        type: SET_PERSON,
        payload: person,
    };
}

export function setSquinting(isSquinting: boolean): ISetSquintAction {
    return {
        type: SET_SQUINT,
        payload: isSquinting,
    };
}

export function setBright(isBright: boolean): ISetBrightAction {
    return {
        type: SET_BRIGHT,
        payload: isBright,
    };
}
