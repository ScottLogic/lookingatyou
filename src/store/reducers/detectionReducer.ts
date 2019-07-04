import { IDetection } from '../../models/objectDetection';
import { ICoords } from '../../utils/types';
import {
    DetectionActionType,
    IDetectionState,
    SET_DETECTIONS,
    SET_MODEL_LOADED,
    SET_TARGET,
} from '../actions/detections/types';

export const initialState: IDetectionState = {
    isModelLoaded: false,
    target: { x: 0, y: 0 },
    detections: [],
};

const detectionActionMapping = {
    [SET_MODEL_LOADED]: setModelLoaded,
    [SET_TARGET]: setTarget,
    [SET_DETECTIONS]: setDetections,
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
        target: { ...(action.payload as ICoords) },
    };
}

function setDetections(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return { ...state, detections: action.payload as IDetection[] };
}

export default detectionStore;
