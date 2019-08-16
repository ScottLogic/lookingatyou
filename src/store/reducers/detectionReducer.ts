import { eyelidPosition, targetingConsts } from '../../AppConstants';
import {
    DetectionActionType,
    IDetectionState,
    ISetAnimationAction,
    ISetDetectionsAction,
    ISetIntervalAction,
    ISetModelAction,
    ISetOpenAction,
    ISwapSelectionAction,
    SET_ANIMATION,
    SET_DETECTIONS,
    SET_INTERVAL,
    SET_MODEL,
    SET_OPEN,
    SWAP_SELECTION,
    TOGGLE_ANIMATION_COOLDOWN,
} from '../actions/detections/types';

export const initialState: IDetectionState = {
    model: null,
    detections: [],
    eyesOpenCoefficient: eyelidPosition.OPEN,
    detectionInterval: 0,
    animation: [],
    animationCoolDown: false,
    nextSelectionSwapTime: -1,
    history: [],
};

const detectionActionMapping = {
    [SET_MODEL]: setModel,
    [SET_INTERVAL]: setDetectionInterval,
    [SET_DETECTIONS]: setDetections,
    [SET_OPEN]: setOpen,
    [SET_ANIMATION]: setAnimation,
    [SWAP_SELECTION]: swapSelection,
    [TOGGLE_ANIMATION_COOLDOWN]: toggleAnimationCooldown,
};

const detectionStore = (
    state: IDetectionState = initialState,
    action: DetectionActionType,
): IDetectionState => {
    return detectionActionMapping.hasOwnProperty(action.type)
        ? detectionActionMapping[action.type](state, action)
        : state;
};

function setModel(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return { ...state, model: (action as ISetModelAction).payload };
}

function setDetectionInterval(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return {
        ...state,
        detectionInterval: (action as ISetIntervalAction).payload,
    };
}

function setDetections(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    const payload = (action as ISetDetectionsAction).payload;
    const newHistory = [...state.history];
    if (state.history.length >= targetingConsts.maxNum) {
        newHistory.shift();
    }
    newHistory.push({
        target: payload.previousTarget,
        color: payload.previousColor,
    });

    return {
        ...state,
        detections: payload.detections,
        history: newHistory,
    };
}

function swapSelection(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    const payload = (action as ISwapSelectionAction).payload;
    return {
        ...state,
        history: initialState.history,
        detections: payload.selection ? [payload.selection] : [],
        nextSelectionSwapTime: payload.nextSelectionSwapTime,
    };
}

function setOpen(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return {
        ...state,
        eyesOpenCoefficient: (action as ISetOpenAction).payload,
    };
}

function setAnimation(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return { ...state, animation: (action as ISetAnimationAction).payload };
}

function toggleAnimationCooldown(
    state: IDetectionState,
    ignore: DetectionActionType,
): IDetectionState {
    return { ...state, animationCoolDown: !state.animationCoolDown };
}

export default detectionStore;
