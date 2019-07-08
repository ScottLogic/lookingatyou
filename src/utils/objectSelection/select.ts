import { IDetection } from '../../models/objectDetection';
import { Bbox, ICoords } from '../types';

export default function select(
    detections: IDetection[],
    compare: (x: Bbox, y: Bbox) => boolean,
): Bbox | undefined {
    const personBboxes = detections
        .filter(detection => detection.info.type === 'person')
        .map(detection => detection.bbox);
    if (personBboxes.length === 0) {
        return undefined;
    }
    let best = 0;
    for (let i = 1; i < personBboxes.length; i++) {
        if (compare(personBboxes[i], personBboxes[best])) {
            best = i;
        }
    }
    return personBboxes[best];
}

export function largerThan(bbox1: Bbox, bbox2: Bbox): boolean {
    return bbox1[2] * bbox1[3] > bbox2[2] * bbox2[3];
}

export function closerTo(
    coords: ICoords,
): (bbox1: Bbox, bbox2: Bbox) => boolean {
    return function closerToCoords(bbox1: Bbox, bbox2: Bbox) {
        return (
            Math.hypot(bbox1[0] - coords.x, bbox1[1] - coords.y) <
            Math.hypot(bbox2[0] - coords.x, bbox2[1] - coords.y)
        );
    };
}

export function first(bbox1: Bbox, bbox2: Bbox): boolean {
    return false;
}
