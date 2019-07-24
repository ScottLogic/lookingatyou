import * as posenet from '@tensorflow-models/posenet';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { Detections, IDetection } from '../../../models/objectDetection';
import { Animation, animationMapping } from '../../../utils/pose/animations';
import { getPose } from '../../../utils/pose/poseDetection';
import { ICoords } from '../../../utils/types';
import { reshapeDetections } from '../../../utils/utils';
import { IRootStore } from '../../reducers/rootReducer';
import {
    getDetections,
    getSelections,
    getTargets,
} from '../../selectors/detectionSelectors';
import { getVideos } from '../../selectors/videoSelectors';
import {
    ISetAnimationAction,
    ISetDetectionsAction,
    ISetIdleTargetAction,
    ISetModelAction,
    ISetOpenAction,
    SET_ANIMATION,
    SET_DETECTIONS,
    SET_IDLE_TARGET,
    SET_MODEL,
    SET_OPEN,
} from './types';

export function setModel(model: posenet.PoseNet | null): ISetModelAction {
    return {
        type: SET_MODEL,
        payload: model,
    };
}

export function loadModel() {
    return async (dispatch: ThunkDispatch<IRootStore, void, Action>) => {
        dispatch(setModel(null));
        const model = await posenet.load();
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
        if (getState().detectionStore.animation.length === 0) {
            const state = getState();
            const images = getVideos(state);
            const model = state.detectionStore.model;

            let left: IDetection[] = [];
            const leftImage = images[0];
            if (leftImage && model) {
                const leftDetections = await model.estimateMultiplePoses(
                    leftImage,
                );
                left = reshapeDetections(leftDetections);
            }

            dispatch(setDetections(left, getTargets(state)));

            // The way we get target will change once #273 is implemented
            // For now I compare selection bounding box to existing detections and select a target from there
            const selection = getSelections(getState());
            const target = getDetections(getState()).filter(
                detection => detection.bbox === selection,
            );

            if (target && target[0]) {
                const pose = getPose(target[0]!);
                if (pose) {
                    dispatch(setAnimation(animationMapping[pose]()));
                }
            }
        }
    };
}

export function setIdleTarget(coords: ICoords): ISetIdleTargetAction {
    return {
        type: SET_IDLE_TARGET,
        payload: coords,
    };
}

export function setDetections(
    detections: Detections,
    previousTarget: ICoords,
): ISetDetectionsAction {
    return {
        type: SET_DETECTIONS,
        payload: { detections, previousTarget },
    };
}

export function setOpen(openCoefficient: number): ISetOpenAction {
    return {
        type: SET_OPEN,
        payload: openCoefficient,
    };
}

export function setAnimation(animation: Animation): ISetAnimationAction {
    return {
        type: SET_ANIMATION,
        payload: animation,
    };
}
