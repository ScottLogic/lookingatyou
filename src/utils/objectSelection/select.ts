import { IDetection } from '../../models/objectDetection';
import { Bbox, ICoords } from '../types';

export default function select(
    detections: IDetection[],
    compare: (x: Bbox, y: Bbox) => number,
    filter: (d: IDetection) => boolean = b => true,
): Bbox | undefined {
    const personBboxes: Bbox[] = detections
        .filter(
            detection => detection.info.type === 'person' && filter(detection),
        )
        .map(detection => detection.bbox);
    return personBboxes.reduce<Bbox | undefined>(
        (best, current) =>
            best === undefined || compare(current, best) > 0 ? current : best,
        undefined,
    );
}

export function leftOf(x: number) {
    return (detection: IDetection) => {
        return detection.bbox[0] < x;
    };
}

export function rightOf(x: number) {
    return (detection: IDetection) => {
        return detection.bbox[0] > x;
    };
}

export function largerThan(bbox1: Bbox, bbox2: Bbox): number {
    return bbox1[2] * bbox1[3] - bbox2[2] * bbox2[3];
}

export function closerTo(
    coords: ICoords,
): (bbox1: Bbox, bbox2: Bbox) => number {
    return function closerToCoords(bbox1: Bbox, bbox2: Bbox) {
        return (
            Math.hypot(bbox2[0] - coords.x, bbox2[1] - coords.y) -
            Math.hypot(bbox1[0] - coords.x, bbox1[1] - coords.y)
        );
    };
}

export function closerYTo(y: number): (bbox1: Bbox, bbox2: Bbox) => number {
    return function closerToCoords(bbox1: Bbox, bbox2: Bbox) {
        return Math.abs(bbox2[1] - y) - Math.abs(bbox1[1] - y);
    };
}

export function first(bbox1: Bbox, bbox2: Bbox): number {
    return 0;
}
