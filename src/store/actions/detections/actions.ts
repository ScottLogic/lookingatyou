import { load, PoseNet } from '@tensorflow-models/posenet';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { targetingConsts } from '../../../AppConstants';
import { Detections, IDetection } from '../../../models/objectDetection';
import calculateTargetPos from '../../../utils/objectTracking/calculateFocus';
import { Animation, animationMapping } from '../../../utils/pose/animations';
import { getPose } from '../../../utils/pose/poseDetection';
import { IColour, ICoords } from '../../../utils/types';
import { getImageDataFromVideo, reshapeDetections } from '../../../utils/utils';
import { IRootStore } from '../../reducers/rootReducer';
import { getConfig, getFPS } from '../../selectors/configSelectors';
import {
    getColour,
    getDetections,
    getSelections,
    getTargets,
} from '../../selectors/detectionSelectors';
import { getVideo } from '../../selectors/videoSelectors';
import { createActionPayload } from '../creators';
import { setImageDataAction } from '../video/actions';
import {
    ISwapSelectionActionPayload,
    SET_ANIMATION,
    SET_DETECTIONS,
    SET_IDLE_TARGET,
    SET_MODEL,
    SET_OPEN,
    SWAP_SELECTION,
} from './types';

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
        const state = getState();
        const video = getVideo(state);
        const model = state.detectionStore.model;
        const detectionConfig = getConfig(state).detectionConfig;

        if (!video || !model) {
            return;
        }

        const image = getImageDataFromVideo(video, document);

        if (image) {
            dispatch(setImageDataAction(image));
        }

        let detections: IDetection[] = [];
        if (image && model) {
            const leftDetections = await model.estimateMultiplePoses(
                image,
                detectionConfig,
            );
            detections = reshapeDetections(leftDetections);
        }

        dispatch(setDetectionsAndMaybeSwapTarget(detections));

        // The way we get target will change once #273 is implemented
        // For now I compare selection bounding box to existing detections and select a target from there
        const selection = getSelections(getState());
        const target = getDetections(getState()).filter(
            detection => detection === selection,
        );

        if (
            target &&
            target[0] &&
            getState().detectionStore.animation.length === 0
        ) {
            const pose = getPose(target[0]!);
            if (pose) {
                let poseAnimation = animationMapping[pose];
                poseAnimation = Array.isArray(poseAnimation)
                    ? poseAnimation
                    : poseAnimation();
                dispatch(setAnimation(poseAnimation));
            }
        }
    };
}

export function setDetectionsAndMaybeSwapTarget(detections: Detections) {
    return (
        dispatch: ThunkDispatch<IRootStore, void, Action>,
        getState: () => IRootStore,
    ) => {
        const state = getState();
        const now = new Date().getTime();
        if (now < state.detectionStore.nextSelectionSwapTime) {
            dispatch(
                setDetections({
                    detections,
                    previousTarget: getTargets(state),
                    previousColour: getColour(state),
                }),
            );
        } else {
            const previousSelection = getSelections(state);
            if (previousSelection && detections.length > 1) {
                removeClosestToSelection(detections, previousSelection);
            }

            const selectionIndex = Math.floor(
                Math.random() * (detections.length - 1),
            );
            const nextSelectionSwapTime =
                now +
                targetingConsts.minInterval +
                (targetingConsts.maxInterval - targetingConsts.minInterval) *
                    Math.random();
            const selection =
                detections.length > 0 ? detections[selectionIndex] : undefined;
            dispatch(swapSelection({ selection, nextSelectionSwapTime }));
        }
    };
}

function removeClosestToSelection(
    detections: IDetection[],
    selection: IDetection,
) {
    const selectionTargetPos = calculateTargetPos(selection.bbox);
    let closestIndex = 0;
    let closestDistance = Number.MAX_SAFE_INTEGER;
    detections.forEach((detection, index) => {
        const targetPos = calculateTargetPos(detection.bbox);
        const distance = Math.hypot(
            targetPos.x - selectionTargetPos.x,
            targetPos.y - selectionTargetPos.y,
        );
        if (distance < closestDistance) {
            closestIndex = index;
            closestDistance = distance;
        }
    });
    detections.splice(closestIndex, 1);
}

export const setDetections = createActionPayload<
    typeof SET_DETECTIONS,
    {
        detections: Detections;
        previousTarget: ICoords;
        previousColour: IColour;
    }
>(SET_DETECTIONS);

export const swapSelection = createActionPayload<
    typeof SWAP_SELECTION,
    ISwapSelectionActionPayload
>(SWAP_SELECTION);

export const setModel = createActionPayload<typeof SET_MODEL, PoseNet | null>(
    SET_MODEL,
);

export const setIdleTarget = createActionPayload<
    typeof SET_IDLE_TARGET,
    ICoords
>(SET_IDLE_TARGET);

export const setOpen = createActionPayload<typeof SET_OPEN, number>(SET_OPEN);

export const setAnimation = createActionPayload<
    typeof SET_ANIMATION,
    Animation
>(SET_ANIMATION);
