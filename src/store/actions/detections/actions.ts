import * as posenet from '@tensorflow-models/posenet';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { EyeSide } from '../../../AppConstants';
import { Detections, IDetection } from '../../../models/objectDetection';
import { ICoords } from '../../../utils/types';
import {
    getImageDataFromVideos,
    reshapeDetections,
} from '../../../utils/utils';
import { IRootStore } from '../../reducers/rootReducer';
import { getTargets } from '../../selectors/detectionSelectors';
import { getVideos } from '../../selectors/videoSelectors';
import { setImageDataAction } from '../video/actions';
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

export function setModel(model: posenet.PoseNet | null): ISetModelAction {
    return {
        type: SET_MODEL,
        payload: model,
    };
}

export function loadModel(document: Document) {
    return async (dispatch: ThunkDispatch<IRootStore, void, Action>) => {
        dispatch(setModel(null));
        const model = await posenet.load();
        dispatch(setModel(model));
        dispatch(restartDetection(document));
    };
}

export function restartDetection(document: Document) {
    return (
        dispatch: ThunkDispatch<IRootStore, void, Action>,
        getState: () => IRootStore,
    ) => {
        const state = getState();
        clearInterval(state.detectionStore.detectionInterval);
        const id = setInterval(
            () => dispatch(handleDetection(document)),
            1000 / state.configStore.config.fps,
        );
        dispatch({ type: 'SET_INTERVAL', payload: id });
    };
}

export function handleDetection(document: Document) {
    return async (
        dispatch: ThunkDispatch<IRootStore, void, Action>,
        getState: () => IRootStore,
    ) => {
        const state = getState();
        const videos = getVideos(state);
        const model = state.detectionStore.model;

        if (!videos[0] || !model) {
            return;
        }

        const images = getImageDataFromVideos(videos, document);
        dispatch(setImageDataAction(images));

        let left: IDetection[] = [];
        const leftImage = images[EyeSide.LEFT];
        if (leftImage && model) {
            const leftDetections = await model.estimateMultiplePoses(leftImage);
            left = reshapeDetections(leftDetections);
        }

        dispatch(setDetections(left, getTargets(state)));
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
