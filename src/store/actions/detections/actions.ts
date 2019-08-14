import { load, PoseNet } from '@tensorflow-models/posenet';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import {
    animationCooldownTimeout,
    targetingConsts,
} from '../../../AppConstants';
import { Detections, IDetection } from '../../../models/objectDetection';
import calculateTargetPos from '../../../utils/objectTracking/calculateFocus';
import { Animation, animationMapping } from '../../../utils/pose/animations';
import { getPose } from '../../../utils/pose/poseDetection';
import { IColor, ICoords } from '../../../utils/types';
import { getImageDataFromVideo, reshapeDetections } from '../../../utils/utils';
import { IRootStore } from '../../reducers/rootReducer';
import { getConfig, getFPS } from '../../selectors/configSelectors';
import {
    getAnimationExists,
    getColor,
    getSelections,
    getTargets,
} from '../../selectors/detectionSelectors';
import { getVideo } from '../../selectors/videoSelectors';
import { createAction, createActionPayload } from '../creators';
import { setImageDataAction } from '../video/actions';
import {
    ISwapSelectionActionPayload,
    SET_ANIMATION,
    SET_DETECTIONS,
    SET_INTERVAL,
    SET_MODEL,
    SET_OPEN,
    SWAP_SELECTION,
    TOGGLE_ANIMATION_COOLDOWN,
} from './types';

export function loadModel(window: Window) {
    return async (
        dispatch: ThunkDispatch<IRootStore, void, Action>,
        getState: () => IRootStore,
    ) => {
        dispatch(setModel(null));
        const config = getConfig(getState());
        const model = await load(config.modelConfig);
        dispatch(setModel(model));
        dispatch(restartDetection(window));
    };
}

export function restartDetection(window: Window) {
    return (
        dispatch: ThunkDispatch<IRootStore, void, Action>,
        getState: () => IRootStore,
    ) => {
        const state = getState();
        dispatch(handleDetection(document));
        window.clearInterval(state.detectionStore.detectionInterval);
        const id = window.setInterval(
            () => dispatch(handleDetection(window.document)),
            1000 / getFPS(state),
        );
        dispatch({ type: SET_INTERVAL, payload: id });
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

        if (!image) {
            return;
        }

        dispatch(setImageDataAction(image));
        const detections = reshapeDetections(
            await model.estimateMultiplePoses(image, detectionConfig),
        );

        dispatch(setDetectionsAndMaybeSwapTarget(detections));

        const selection = getSelections(getState());
        if (
            selection &&
            !getAnimationExists(getState()) &&
            !getState().detectionStore.animationCoolDown
        ) {
            const pose = getPose(selection);
            if (pose) {
                let poseAnimation = animationMapping[pose];
                poseAnimation = Array.isArray(poseAnimation)
                    ? poseAnimation
                    : poseAnimation();
                dispatch(setAnimation(poseAnimation));
                dispatch(toggleAnimationCoolDown());
                window.setTimeout(() => {
                    dispatch(toggleAnimationCoolDown());
                }, animationCooldownTimeout);
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
                    previousColor: getColor(state),
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
        previousColor: IColor;
    }
>(SET_DETECTIONS);

export const swapSelection = createActionPayload<
    typeof SWAP_SELECTION,
    ISwapSelectionActionPayload
>(SWAP_SELECTION);

export const setModel = createActionPayload<typeof SET_MODEL, PoseNet | null>(
    SET_MODEL,
);

export const setOpen = createActionPayload<typeof SET_OPEN, number>(SET_OPEN);

export const setAnimation = createActionPayload<
    typeof SET_ANIMATION,
    Animation
>(SET_ANIMATION);

export const toggleAnimationCoolDown = createAction<
    typeof TOGGLE_ANIMATION_COOLDOWN
>(TOGGLE_ANIMATION_COOLDOWN);
