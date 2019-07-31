import { load, PoseNet } from '@tensorflow-models/posenet';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { EyeSide, targetingConsts } from '../../../AppConstants';
import { Detections, IDetection } from '../../../models/objectDetection';
import { Animation, animationMapping } from '../../../utils/pose/animations';
import { getPose } from '../../../utils/pose/poseDetection';
import { IColour, ICoords } from '../../../utils/types';
import {
    getImageDataFromVideos,
    reshapeDetections,
} from '../../../utils/utils';
import { IRootStore } from '../../reducers/rootReducer';
import { getConfig, getFPS } from '../../selectors/configSelectors';
import {
    getColour,
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
    ISwapSelectionAction,
    SET_ANIMATION,
    SET_DETECTIONS,
    SET_IDLE_TARGET,
    SET_MODEL,
    SET_OPEN,
    SWAP_SELECTION,
} from './types';

export function setModel(model: PoseNet | null): ISetModelAction {
    return {
        type: SET_MODEL,
        payload: model,
    };
}

export function loadModel(document: Document) {
    return async (
        dispatch: ThunkDispatch<IRootStore, void, Action>,
        getState: () => IRootStore,
    ) => {
        dispatch(setModel(null));
        const config = getConfig(getState());
        const model = await load(config.modelConfig);
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
            1000 / getFPS(state),
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
            const videos = getVideos(state);
            const model = state.detectionStore.model;
            const detectionConfig = getConfig(state).detectionConfig;

            if (!videos[0] || !model) {
                return;
            }

            const image = getImageDataFromVideos(videos, document);

            let detections: IDetection[] = [];
            if (image && model) {
                dispatch(setImageDataAction(image));
                const leftDetections = await model.estimateMultiplePoses(
                    image,
                    detectionConfig,
                );
                detections = reshapeDetections(leftDetections);
            }

            dispatch(
                setDetectionsAndMaybeSwapTarget(
                    detections,
                    getTargets(state),
                    getColour(state),
                ),
            );

            // The way we get target will change once #273 is implemented
            // For now I compare selection bounding box to existing detections and select a target from there
            const selection = getSelections(getState());
            const target = getDetections(getState()).filter(
                detection => detection === selection,
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

export function setDetectionsAndMaybeSwapTarget(
    detections: Detections,
    previousTarget: ICoords,
    previousColour: IColour,
) {
    return (
        dispatch: ThunkDispatch<IRootStore, void, Action>,
        getState: () => IRootStore,
    ) => {
        const state = getState();
        const now = new Date().getTime();
        if (now < state.detectionStore.nextSelectionSwapTime) {
            dispatch(setDetections(detections, previousTarget, previousColour));
        } else {
            const selectionIndex = Math.floor(
                Math.random() * (detections.length - 1),
            );
            const nextTargetSwapTime =
                now +
                targetingConsts.minInterval +
                (targetingConsts.maxInterval - targetingConsts.minInterval) *
                    Math.random();
            dispatch(
                swapSelection(
                    detections.length > 0
                        ? detections[selectionIndex]
                        : undefined,
                    nextTargetSwapTime,
                ),
            );
        }
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

export function swapSelection(
    selection: IDetection | undefined,
    nextSelectionSwapTime: number,
): ISwapSelectionAction {
    return {
        type: SWAP_SELECTION,
        payload: { selection, nextSelectionSwapTime },
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
