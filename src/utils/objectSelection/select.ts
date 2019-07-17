import { Detection, ISelections } from '../../models/objectDetection';
import calculateTargetPos from '../objectTracking/calculateFocus';
import { Bbox } from '../types';
import { isPerson } from './detectionSelector';

let xPrediction = 0;
let yPrediction = 0;

export default function select(
    detections: Detection[],
    leftCam: boolean,
    compare: (x: Bbox, y: Bbox) => number,
    history?: ISelections[],
    filter?: (d: Detection) => boolean,
): Bbox | undefined {
    const personBboxes: Bbox[] = detections
        .filter(
            detection => isPerson(detection) && (!filter || filter(detection)),
        )
        .map(detection => detection.bbox);

    if (history) {
        let coordsX: number[] = [];
        let coordsY: number[] = [];
        if (leftCam) {
            coordsX = history.map(target => target.left[0]);
            coordsY = history.map(target => target.left[1]);
        } else {
            coordsX = history.map(target =>
                target.right ? target.right[0] : 0,
            );
            coordsY = history.map(target =>
                target.right ? target.right[1] : 0,
            );
        }

        xPrediction = getWeightedPrediction(coordsX);
        yPrediction = getWeightedPrediction(coordsY);
    }

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

export function closerTo(): (bbox1: Bbox, bbox2: Bbox) => number {
    return function closerToCoords(bbox1: Bbox, bbox2: Bbox) {
        const closerToPredictedTarget =
            Math.hypot(bbox2[0] - xPrediction, bbox2[1] - yPrediction) -
            Math.hypot(bbox1[0] - xPrediction, bbox1[1] - yPrediction);

        return closerToPredictedTarget; // + closerToOldTarget;
    };
}

function getWeightedPrediction(nums: number[]): number {
    const weightedNums = [];
    let decayTotal = 0;
    const diffNums = [];

    for (let i = 0; i < nums.length - 1; i++) {
        diffNums.push(nums[i] - nums[i + 1]);
    }

    for (let i = diffNums.length - 1; i > 0; i--) {
        const decay = Math.pow(0.5, i);
        weightedNums.push(diffNums[i] * decay);
        decayTotal += decay;
    }

    const weightedTotal = weightedNums.reduce((a, b) => a + b, 0) / decayTotal;

    return weightedTotal / diffNums.length + nums[nums.length - 1];
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
