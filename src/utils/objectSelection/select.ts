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
        /*      const closerToOldTarget =
            Math.hypot(bbox2[0] - coords.x, bbox2[1] - coords.y) -
            Math.hypot(bbox1[0] - coords.x, bbox1[1] - coords.y);
*/
        const coordsX = history.map(target => target.left[0]);
        const coordsY = history.map(target => target.left[1]);

        const predictedX = getWeightedPrediction(coordsX);
        const predictedY = getWeightedPrediction(coordsY);

        const closerToPredictedTarget =
            Math.hypot(bbox2[0] - predictedX, bbox2[1] - predictedY) -
            Math.hypot(bbox1[0] - predictedX, bbox1[1] - predictedY);

        return closerToPredictedTarget;
    };
}

function getWeightedPrediction(nums: number[]): number {
    const weightedNums = [];
    for (let i = nums.length - 1; i > 0; i--) {
        weightedNums.push(nums[i] * Math.pow(0.5, i));
    }
    const weightedTotal = weightedNums.reduce((a, b) => a + b);
    return weightedTotal / history.length + nums[nums.length - 1];
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
