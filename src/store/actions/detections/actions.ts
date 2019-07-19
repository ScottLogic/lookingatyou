import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import {
    IDetection,
    IDetections,
    IObjectDetector,
} from '../../../models/objectDetection';
import Posenet from '../../../utils/objectDetection/posenet';
import { ICoords, ITargets } from '../../../utils/types';
import { IRootStore } from '../../reducers/rootReducer';
import { getTargets } from '../../selectors/detectionSelectors';
import { getVideos } from '../../selectors/videoSelectors';
import {
    ISetDetectionsAction,
    ISetIdleTargetAction,
    ISetModelAction,
    ISetOpenAction,
    SET_DETECTIONS,
    SET_IDLE_TARGET,
    SET_MODEL,
    SET_OPEN,
} from './types';

export function setModel(model: IObjectDetector | null): ISetModelAction {
    return {
        type: SET_MODEL,
        payload: model,
    };
}

export function loadModel() {
    return async (dispatch: ThunkDispatch<IRootStore, void, Action>) => {
        dispatch(setModel(null));
        const model = await Posenet.init();
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

        let left: IDetection[] = [];
        const leftImage = images[0];
        if (leftImage && model) {
            left = await model.detect(leftImage);
        }

        let right: IDetection[] = [];
        const rightImage = images[1];
        if (rightImage && model) {
            right = await model.detect(rightImage);
        }

        dispatch(setDetections({ left, right }, getTargets(state)));
    };
}

export function setIdleTarget(coords: ICoords): ISetIdleTargetAction {
    return {
        type: SET_IDLE_TARGET,
        payload: coords,
    };
}

export function setDetections(
    detections: IDetections,
    previousTarget: ITargets,
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
