import { eyelidPosition } from '../../AppConstants';
import { IDetections, ISelections } from '../../models/objectDetection';
import { ITargets } from '../../utils/types';
import {
    DetectionActionType,
    IDetectionState,
    SET_DETECTIONS,
    SET_MODEL_LOADED,
    SET_OPEN,
    SET_SELECTIONS,
    SET_TARGET,
} from '../actions/detections/types';

export const initialState: IDetectionState = {
    isModelLoaded: false,
    target: { left: { x: 0, y: 0 }, right: null },
    detections: { left: [], right: null },
    selections: { left: [0, 0, 0, 0], right: null },
    openCoefficient: eyelidPosition.OPEN,
};

const detectionActionMapping = {
    [SET_MODEL_LOADED]: setModelLoaded,
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

function setModelLoaded(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return { ...state, isModelLoaded: action.payload as boolean };
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
    return { ...state, selections: action.payload as ISelections };
}

function setOpen(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return { ...state, openCoefficient: action.payload as number };
}

export default detectionStore;
