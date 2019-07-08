import { ISelections } from '../../models/objectDetection';
import { IRootStore } from '../reducers/rootReducer';

export function getSelections(state: IRootStore): ISelections {
    return state.detectionStore.selections;
}
