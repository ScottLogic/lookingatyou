import { PoseNet } from '@tensorflow-models/posenet';
import { eyelidPosition, targetingConsts } from '../../AppConstants';
import { Animation } from '../../utils/pose/animations';
import { ICoords } from '../../utils/types';
import {
    DetectionActionType,
    IDetectionState,
    ISetDetectionsActionPayload,
    ISwapSelectionActionPayload,
    SET_ANIMATION,
    SET_DETECTIONS,
    SET_IDLE_TARGET,
    SET_INTERVAL,
    SET_MODEL,
    SET_OPEN,
    SWAP_SELECTION,
} from '../actions/detections/types';

export const initialState: IDetectionState = {
    model: null,
    idleTarget: { x: 0, y: 0 },
    detections: [],
    eyesOpenCoefficient: eyelidPosition.OPEN,
    detectionInterval: 0,
    animation: [],
    nextSelectionSwapTime: -1,
    history: [],
};

const detectionActionMapping = {
    [SET_MODEL]: setModel,
    [SET_INTERVAL]: setDetectionInterval,
    [SET_IDLE_TARGET]: setIdleTarget,
    [SET_DETECTIONS]: setDetections,
    [SET_OPEN]: setOpen,
    [SET_ANIMATION]: setAnimation,
    [SWAP_SELECTION]: swapSelection,
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
    return { ...state, model: action.payload as PoseNet };
}

function setDetectionInterval(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return { ...state, detectionInterval: action.payload as number };
}

function setIdleTarget(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return {
        ...state,
        idleTarget: action.payload as ICoords,
    };
}

function setDetections(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    const payload = action.payload as ISetDetectionsActionPayload;
    const newHistory = [...state.history];
    if (state.history.length >= targetingConsts.maxNum) {
        newHistory.shift();
    }
    newHistory.push({
        target: payload.previousTarget,
        colour: payload.previousColour,
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
    const payload = action.payload as ISwapSelectionActionPayload;
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
    return { ...state, eyesOpenCoefficient: action.payload as number };
}

function setAnimation(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return { ...state, animation: action.payload as Animation };
}

export default detectionStore;
