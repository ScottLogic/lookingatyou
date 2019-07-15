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
    SET_BRIGHT,
    SET_DETECTIONS,
    SET_DILATION,
    SET_INTERVAL,
    SET_LEFT,
    SET_MODEL,
    SET_OPEN,
    SET_PERSON,
    SET_SELECTIONS,
    SET_SQUINT,
    SET_TARGET,
} from '../actions/detections/types';

export const initialState: IDetectionState = {
    model: null,
    detectionInterval: 0,
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
    [SET_MODEL]: setModel,
    [SET_INTERVAL]: setDetectionInterval,
    [SET_TARGET]: setTarget,
    [SET_DETECTIONS]: setDetections,
    [SET_BRIGHT]: setBright,
    [SET_DILATION]: setDilation,
    [SET_LEFT]: setLeft,
    [SET_PERSON]: setPerson,
    [SET_OPEN]: setOpen,
    [SET_SQUINT]: setSquinting,
    [SET_SELECTIONS]: setSelections,
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

function setSelections(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return { ...state, selections: action.payload as ISelections };
}

export default detectionStore;
