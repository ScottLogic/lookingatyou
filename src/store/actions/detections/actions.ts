import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import {
    Detection,
    DetectionModelType,
    IDetections,
    IObjectDetector,
} from '../../../models/objectDetection';
import CocoSSD from '../../../utils/objectDetection/cocoSSD';
import Posenet from '../../../utils/objectDetection/posenet';
import { ICoords } from '../../../utils/types';
import { IRootStore } from '../../reducers/rootReducer';
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
    return async (
        dispatch: ThunkDispatch<IRootStore, void, Action>,
        getState: () => IRootStore,
    ) => {
        const state = getState();
        dispatch(setModel(null));
        let model;
        switch (state.configStore.config.model) {
            case DetectionModelType.Posenet:
                model = await Posenet.init();
                break;
            case DetectionModelType.CocoSSD:
                model = await CocoSSD.init();
                break;
        }
        if (model) {
            dispatch(setModel(model));
        }
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

        let left: Detection[] = [];
        const leftImage = images[0];
        if (leftImage && model) {
            left = await model.detect(leftImage);
        }

        let right: Detection[] = [];
        const rightImage = images[1];
        if (rightImage && model) {
            right = await model.detect(rightImage);
        }

        dispatch(setDetections({ left, right }));
    };
}

export function setIdleTarget(coords: ICoords): ISetIdleTargetAction {
    return {
        type: SET_IDLE_TARGET,
        payload: coords,
    };
}

export function setDetections(detections: IDetections): ISetDetectionsAction {
    return {
        type: SET_DETECTIONS,
        payload: detections,
    };
}

export function setOpen(openCoefficient: number): ISetOpenAction {
    return {
        type: SET_OPEN,
        payload: openCoefficient,
    };
}
