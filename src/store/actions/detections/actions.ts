import * as posenet from '@tensorflow-models/posenet';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { EyeSide } from '../../../AppConstants';
import { Detections, IDetection } from '../../../models/objectDetection';
import { Animation, animationMapping } from '../../../utils/pose/animations';
import { getPose } from '../../../utils/pose/poseDetection';
<<<<<<< HEAD
import { ICoords } from '../../../utils/types';
import { reshapeDetections } from '../../../utils/utils';
import { IRootStore } from '../../reducers/rootReducer';
import {
=======
import { IColour, ICoords } from '../../../utils/types';
import {
    getImageDataFromVideos,
    reshapeDetections,
} from '../../../utils/utils';
import { IRootStore } from '../../reducers/rootReducer';
import {
    getColour,
>>>>>>> master
    getDetections,
    getSelections,
    getTargets,
} from '../../selectors/detectionSelectors';
import { getVideos } from '../../selectors/videoSelectors';
import { setImageDataAction } from '../video/actions';
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
        if (getState().detectionStore.animation.length === 0) {
            const state = getState();
<<<<<<< HEAD
            const images = getVideos(state);
            const model = state.detectionStore.model;

            let left: IDetection[] = [];
            const leftImage = images[0];
=======
            const videos = getVideos(state);
            const model = state.detectionStore.model;

            if (!videos[0] || !model) {
                return;
            }

            const images = getImageDataFromVideos(videos, document);
            dispatch(setImageDataAction(images));

            let left: IDetection[] = [];
            const leftImage = images[EyeSide.LEFT];
>>>>>>> master
            if (leftImage && model) {
                const leftDetections = await model.estimateMultiplePoses(
                    leftImage,
                );
                left = reshapeDetections(leftDetections);
            }

<<<<<<< HEAD
            dispatch(setDetections(left, getTargets(state)));

            // The way we get target will change once #273 is implemented
            // For now I compare selection bounding box to existing detections and select a target from there
            const selection = getSelections(getState());
            const target = getDetections(getState()).filter(
                detection => detection.bbox === selection,
            );

=======
            dispatch(setDetections(left, getTargets(state), getColour(state)));

            // The way we get target will change once #273 is implemented
            // For now I compare selection bounding box to existing detections and select a target from there
            const selection = getSelections(getState());
            const target = getDetections(getState()).filter(
                detection => detection === selection,
            );

>>>>>>> master
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
    previousColour: IColour,
): ISetDetectionsAction {
    return {
        type: SET_DETECTIONS,
        payload: { detections, previousTarget, previousColour },
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
