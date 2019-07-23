import { Detections, IDetection } from '../../models/objectDetection';
import calculateTargetPos, {
    calculateNormalisedPos,
} from '../objectTracking/calculateFocus';
import { getPose } from '../pose/poseDetection';
import { Bbox, ICoords } from '../types';

export default function select(
    detections: Detections,
    compare: (x: Bbox, y: Bbox) => number,
    filter?: (d: IDetection) => boolean,
): Bbox | undefined {
    const personBboxes: IDetection[] = detections
        .filter(detection => !filter || filter(detection))
        .map(detection => detection);
    const selection = Object.entries(personBboxes).reduce<
        [string, IDetection] | undefined
    >((best, current) => {
        if (best === undefined) {
            return current;
        } else {
            return compare(current[1].bbox, best[1].bbox) > 0 ? current : best;
        }
    }, undefined);
    if (selection) {
        const pose = getPose(selection[1]);
        if (pose) {
            console.log(pose);
        }
        return selection[1].bbox;
    }
    return undefined;
}

function doAction(action: string) {
    if (action === WAVE) {
        const keyFrames = [];
    }
}

export function setPrediction(history: ICoords[]): ICoords {
    let coordsX: number[] = [];
    let coordsY: number[] = [];

    coordsX = history.map(target => target.x);
    coordsY = history.map(target => target.y);

    const xPrediction = getWeightedPrediction(coordsX);
    const yPrediction = getWeightedPrediction(coordsY);

    return { x: xPrediction, y: yPrediction };
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

export function closerToPrediction(
    prediction: ICoords,
    videoWidth: number,
    videoHeight: number,
): (bbox1: Bbox, bbox2: Bbox) => number {
    return function closerToCoords(bbox1: Bbox, bbox2: Bbox) {
        const coords1 = calculateNormalisedPos(bbox1, videoWidth, videoHeight);
        const coords2 = calculateNormalisedPos(bbox2, videoWidth, videoHeight);
        const closerToPredictedTarget =
            Math.hypot(coords2.x - prediction.x, coords2.y - prediction.y) -
            Math.hypot(coords1.x - prediction.x, coords1.y - prediction.y);

        return closerToPredictedTarget;
    };
}

function getWeightedPrediction(nums: number[]): number {
    const weightedNums = [];
    let decayTotal = 0;
    const diffNums = [];

    for (let i = 0; i < nums.length - 1; i++) {
        diffNums.push(nums[i + 1] - nums[i]);
    }

    for (let i = diffNums.length - 1; i >= 0; i--) {
        const decay = Math.pow(0.5, diffNums.length - i);
        weightedNums.push(diffNums[i] * decay);
        decayTotal += decay;
    }

    const weightedTotal = weightedNums.reduce((a, b) => a + b, 0) / decayTotal;

    return weightedTotal + nums[nums.length - 1];
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
