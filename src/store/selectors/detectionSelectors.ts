import { ISelections } from '../../models/objectDetection';
import { ITargets } from '../../utils/types';
import { IRootStore } from '../reducers/rootReducer';

export function getSelections(state: IRootStore): ISelections {
    return state.detectionStore.selections;
}

export function getTargets(state: IRootStore): ITargets {
    return state.detectionStore.target;
}

export function getOpenCoefficient(state: IRootStore): number {
    return state.detectionStore.eyesOpenCoefficient;
}
