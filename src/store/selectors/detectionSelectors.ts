import { Bbox } from '../../utils/types';
import { IRootStore } from '../reducers/rootReducer';

export function getBbox(state: IRootStore): Bbox {
    const people = state.detectionStore.detections.filter(
        detection => detection.info.type === 'person',
    );

    if (people.length > 0) {
        return people[0].bbox;
    }
}
