import { eyelidPosition, maxNumTargetsToConsider } from '../../AppConstants';
import { IDetections, IObjectDetector } from '../../models/objectDetection';
import { ICoords } from '../../utils/types';
import {
    DetectionActionType,
    IDetectionState,
    SET_DETECTIONS,
    SET_IDLE_TARGET,
    SET_INTERVAL,
    SET_MODEL,
    SET_OPEN,
} from '../actions/detections/types';
import { getTargets } from '../selectors/detectionSelectors';

export const initialState: IDetectionState = {
    model: null,
    idleTarget: { left: { x: 0, y: 0 }, right: { x: 0, y: 0 } },
    detections: { left: [], right: [] },
    eyesOpenCoefficient: eyelidPosition.OPEN,
    detectionInterval: 0,
    history: [{ left: { x: 0, y: 0 }, right: { x: 0, y: 0 } }],
};

const detectionActionMapping = {
    [SET_MODEL]: setModel,
    [SET_INTERVAL]: setDetectionInterval,
    [SET_IDLE_TARGET]: setIdleTarget,
    [SET_DETECTIONS]: setDetections,
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

function setIdleTarget(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return {
        ...state,
        idleTarget: {
            left: action.payload as ICoords,
            right: action.payload as ICoords,
        },
    };
}

function setDetections(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    const newHistory = state.history;
    const oldSelection = getTargets(state);
    if (state.history.length >= maxNumTargetsToConsider) {
        newHistory.shift();
    }
    newHistory.push(oldSelection);
    return {
        ...state,
        detections: action.payload as IDetections,
        history: newHistory,
    };
}

function setOpen(
    state: IDetectionState,
    action: DetectionActionType,
): IDetectionState {
    return { ...state, eyesOpenCoefficient: action.payload as number };
}

export default detectionStore;
