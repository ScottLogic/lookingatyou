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
import calculateTargetPos, {
    normalise,
} from '../../../utils/objectTracking/calculateFocus';
import { ICoords, ITargets } from '../../../utils/types';
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
            () => dispatch(handleDetection),
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
        if (images.length === 0) {
            return;
        }
        const model = state.detectionStore.model;
        const targets = getTargets(state);
        if (model) {
            const leftEyeDetections = await model.detect(images[0]!);
            const leftEyeSelection = select(
                leftEyeDetections,
                closerTo(targets.left),
            );
            if (leftEyeSelection) {
                const leftEyeCoords = calculateTargetPos(leftEyeSelection);
                let rightEyeDetections = null;
                let rightEyeSelection = null;
                const leftTarget = {
                    x: normalise(leftEyeCoords.x, images[0]!.width),
                    y: normalise(leftEyeCoords.y, images[0]!.height),
                };
                let rightTarget = null;
                if (images.length >= 2) {
                    rightEyeDetections = await model.detect(images[1]!);
                    rightEyeSelection = select(
                        rightEyeDetections,
                        closerVerticallyTo(leftEyeSelection[1]),
                        leftOf(leftEyeSelection[0]),
                    );
                    if (rightEyeSelection) {
                        const rightEyeCoords = calculateTargetPos(
                            rightEyeSelection,
                        );
                        rightTarget = {
                            x: normalise(rightEyeCoords.x, images[1]!.width),
                            y: normalise(rightEyeCoords.y, images[1]!.height),
                        };
                        const averageY = rightTarget.y + leftTarget.y;
                        rightTarget.y = averageY;
                        leftTarget.y = averageY;
                    }
                }
                const newTargets = {
                    left: leftTarget,
                    right: rightTarget,
                };
                const leftEyeDist = getLargerDistance(
                    targets.left,
                    newTargets.left,
                );

                if (leftEyeDist > maxMoveWithoutBlink) {
                    dispatch(setOpen(eyelidPosition.CLOSED));
                }

                if (targets.right && newTargets.right) {
                    const rightEyeDist = getLargerDistance(
                        targets.right,
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

function getLargerDistance(old: ICoords, newCoords: ICoords): number {
    return Math.max(
        Math.abs(old.x - newCoords.x),
        Math.abs(old.y - newCoords.y),
    );
}
