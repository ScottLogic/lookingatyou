import {
    Detection,
    IDetections,
    ISelections,
} from '../../models/objectDetection';
import calculateTargetPos from '../objectTracking/calculateFocus';
import { Bbox, ICoords } from '../types';
import { isPerson } from './detectionSelector';

export default function select(
    detections: Detection[],
    compare: (x: Bbox, y: Bbox) => number,
    filter?: (d: Detection) => boolean,
): Bbox | undefined {
    const personBboxes: Bbox[] = detections
        .filter(
            detection => isPerson(detection) && (!filter || filter(detection)),
        )
        .map(detection => detection.bbox);
    return personBboxes.reduce<Bbox | undefined>(
        (best, current) =>
            best === undefined || compare(current, best) > 0 ? current : best,
        undefined,
    );
}

export function leftOf(x: number) {
    return (detection: Detection) => {
        return detection.bbox[0] < x;
    };
}

export function rightOf(x: number) {
    return (detection: Detection) => {
        return detection.bbox[0] > x;
    };
}

export function largerThan(bbox1: Bbox, bbox2: Bbox): number {
    return bbox1[2] * bbox1[3] - bbox2[2] * bbox2[3];
}

export function closerTo(
    coords: ICoords,
    history: ISelections[],
): (bbox1: Bbox, bbox2: Bbox) => number {
    return function closerToCoords(bbox1: Bbox, bbox2: Bbox) {
        const closerTo =
            Math.hypot(bbox2[0] - coords.x, bbox2[1] - coords.y) -
            Math.hypot(bbox1[0] - coords.x, bbox1[1] - coords.y);

        /*
        const weightedAvg = [];
        for (let i = 0; i < history.length; i++) {
            weightedAvg.push(history[i].left[0] * Math.pow(3, i));
        }*/

        return closerTo;
    };
}

export function closerVerticallyTo(
    y: number,
): (bbox1: Bbox, bbox2: Bbox) => number {
    return function closerToCoords(bbox1: Bbox, bbox2: Bbox) {
        return (
            Math.abs(calculateTargetPos(bbox2).y - y) -
            Math.abs(calculateTargetPos(bbox1).y - y)
        );
    };
}

export function first(bbox1: Bbox, bbox2: Bbox): number {
    return 0;
}
