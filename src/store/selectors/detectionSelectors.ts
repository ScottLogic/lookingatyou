import { IDetections, ISelections } from '../../models/objectDetection';
import { ITargets } from '../../utils/types';
import { IRootStore } from '../reducers/rootReducer';

export function getDetections(state: IRootStore): IDetections {
    return state.detectionStore.detections;
}

export function getSelections(state: IRootStore): ISelections {
    return state.detectionStore.selections;
}

export function getTargets(state: IRootStore): ITargets {
    return state.detectionStore.target;
}
