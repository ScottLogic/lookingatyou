import { eyelidPosition } from '../../AppConstants';
import {
    IDetections,
    IObjectDetector,
    ISelections,
} from '../../models/objectDetection';
import { ITargets } from '../../utils/types';
import {
    DetectionActionType,
    IDetectionState,
    SET_DETECTIONS,
    SET_INTERVAL,
    SET_MODEL,
    SET_OPEN,
    SET_SELECTIONS,
    SET_TARGET,
} from '../actions/detections/types';

export const initialState: IDetectionState = {
    model: null,
    target: { left: { x: 0, y: 0 }, right: null },
    detections: { left: [], right: null },
    selections: { left: [0, 0, 0, 0], right: null },
    eyesOpenCoefficient: eyelidPosition.OPEN,
    detectionInterval: 0,
    history: [],
};

const detectionActionMapping = {
    [SET_MODEL]: setModel,
    [SET_INTERVAL]: setDetectionInterval,
    [SET_TARGET]: setTarget,
    [SET_DETECTIONS]: setDetections,
    [SET_SELECTIONS]: setSelections,
    [SET_OPEN]: setOpen,
};

const detectionStore = (
    state: IDetectionState = initialState,
    action: DetectionActionType,
): IDetectionState => {
    return action.type in detectionActionMapping
        ? detectionActionMapping[action.type](state, action)
        : state;
};

function setModel(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return { ...state, model: action.payload as IObjectDetector };
}

function setDetectionInterval(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return { ...state, detectionInterval: action.payload as number };
}

function setTarget(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return {
        ...state,
        target: { ...(action.payload as ITargets) },
    };
}

function setDetections(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return { ...state, detections: action.payload as IDetections };
}

function setSelections(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    if (state.history.length < 8) {
        state.history.push(action.payload as ISelections);
    } else if (state.history.length === 8) {
        state.history.shift();
        state.history.push(action.payload as ISelections);
    }
    return { ...state, selections: action.payload as ISelections };
}

function setOpen(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return { ...state, eyesOpenCoefficient: action.payload as number };
}

export default detectionStore;
