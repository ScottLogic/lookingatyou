import { eyelidPosition } from '../../AppConstants';
import { IDetections } from '../../models/objectDetection';
import { ITargets } from '../../utils/types';
import {
    DetectionActionType,
    IDetectionState,
    SET_BRIGHT,
    SET_DETECTIONS,
    SET_DILATION,
    SET_LEFT,
    SET_MODEL_LOADED,
    SET_OPEN,
    SET_PERSON,
    SET_SQUINT,
    SET_TARGET,
} from '../actions/detections/types';

export const initialState: IDetectionState = {
    isModelLoaded: false,
    tooBright: false,
    left: false,
    personDetected: false,
    isSquinting: false,
    eyesOpenCoefficient: eyelidPosition.OPEN,
    dilationCoefficient: 1,
    target: { left: { x: 0, y: 0 }, right: null },
    detections: { left: [], right: null },
    selections: { left: [0, 0, 0, 0], right: null },
};

const detectionActionMapping = {
    [SET_MODEL_LOADED]: setModelLoaded,
    [SET_TARGET]: setTarget,
    [SET_DETECTIONS]: setDetections,
    [SET_BRIGHT]: setBright,
    [SET_DILATION]: setDilation,
    [SET_LEFT]: setLeft,
    [SET_PERSON]: setPerson,
    [SET_OPEN]: setOpen,
    [SET_SQUINT]: setSquinting,
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

function setBright(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return { ...state, tooBright: action.payload as boolean };
}

function setLeft(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return { ...state, left: action.payload as boolean };
}

function setSquinting(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return { ...state, isSquinting: action.payload as boolean };
}

function setOpen(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return { ...state, eyesOpenCoefficient: action.payload as number };
}

function setDilation(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return { ...state, dilationCoefficient: action.payload as number };
}

function setPerson(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return { ...state, personDetected: action.payload as boolean };
}

export default detectionStore;
