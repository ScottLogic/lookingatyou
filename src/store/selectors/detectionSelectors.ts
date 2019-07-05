import { Bbox } from '../../utils/types';
import { IRootStore } from '../reducers/rootReducer';

export function getBbox(state: IRootStore): Bbox {
    const person = state.detectionStore.detections.find(
        detection => detection.info.type === 'person',
    );

    return person ? person.bbox : undefined;
}
