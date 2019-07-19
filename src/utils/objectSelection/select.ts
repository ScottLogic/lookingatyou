import { IDetection } from '../../models/objectDetection';
import calculateTargetPos, {
    calculateNormalisedPos,
} from '../objectTracking/calculateFocus';
import { Bbox, ICoords, ITargets } from '../types';

export interface IColour {
    r: number;
    g: number;
    b: number;
}

export default function select(
    detections: IDetection[],
    compare: (x: Bbox, y: Bbox) => number,
    filter?: (d: IDetection) => boolean,
): Bbox | undefined {
    const personBboxes: Bbox[] = detections
        .filter(detection => !filter || filter(detection))
        .map(detection => detection.bbox);

    return personBboxes.reduce<Bbox | undefined>(
        (best, current) =>
            best === undefined || compare(current, best) > 0 ? current : best,
        undefined,
    );
}

export function calculateColourMatch(
    imageData: ImageData,
    coords: ICoords,
): IColour {
    if (imageData) {
        const xStart =
            Math.round((coords.x + imageData.width / 2) / imageData.width) - 3;
        const yStart =
            Math.round((coords.y + imageData.height / 2) / imageData.height) -
            3;
        return getAvgColour(xStart, yStart, imageData);
    }
    return { r: 0, g: 0, b: 0 };
}

function getAvgColour(
    xStart: number,
    yStart: number,
    imageData: ImageData,
): { r: number; g: number; b: number } {
    let r = 0;
    let g = 0;
    let b = 0;
    if (imageData) {
        for (
            let i = yStart;
            i < yStart + 6 * 4 * imageData.width;
            i += imageData.width * 4
        ) {
            for (let j = xStart; j < xStart + 6 * 4; j += 4) {
                r = imageData.data[j + i];
                g = imageData.data[j + i + 1];
                b = imageData.data[j + i + 2];
            }
        }
        r = r / 36;
        g = g / 36;
        b = b / 36;
    }
    return { r, g, b };
}

export function setPrediction(leftCam: boolean, history: ITargets[]): ICoords {
    let coordsX: number[] = [];
    let coordsY: number[] = [];
    if (leftCam) {
        coordsX = history.map(target => target.left.x);
        coordsY = history.map(target => target.left.y);
    } else {
        coordsX = history.map(target => (target.right ? target.right.x : 0));
        coordsY = history.map(target => (target.right ? target.right.y : 0));
    }
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

export function closerToColour(
    imageData: ImageData,
    avgColour: IColour,
    bbox1: Bbox,
    bbox2: Bbox,
): number {
    const bbox1AvgColour = getAvgColour(bbox1[0], bbox1[1], imageData);
    const bbox2AvgColour = getAvgColour(bbox2[0], bbox2[1], imageData);

    const bbox1gDiff = Math.pow(bbox1AvgColour.g - avgColour.g, 2);
    const bbox1bDiff = Math.pow(bbox1AvgColour.b - avgColour.b, 2);
    const bbox1rDiff = Math.pow(bbox1AvgColour.r - avgColour.r, 2);
    const bbox2rDiff = Math.pow(bbox2AvgColour.r - avgColour.r, 2);
    const bbox2gDiff = Math.pow(bbox2AvgColour.g - avgColour.g, 2);
    const bbox2bDiff = Math.pow(bbox2AvgColour.b - avgColour.b, 2);

    const bbox1Diff = bbox1rDiff + bbox1gDiff + bbox1bDiff;
    const bbox2Diff = bbox2rDiff + bbox2gDiff + bbox2bDiff;

    return bbox1Diff < bbox2Diff ? 1 : -1;
}

export function closerToPrediction(
    prediction: ICoords,
    videoWidth: number,
    videoHeight: number,
    imageData: ImageData,
    avgColour: IColour,
): (bbox1: Bbox, bbox2: Bbox) => number {
    return function closerToCoords(bbox1: Bbox, bbox2: Bbox) {
        const coords1 = calculateNormalisedPos(bbox1, videoWidth, videoHeight);
        const coords2 = calculateNormalisedPos(bbox2, videoWidth, videoHeight);
        const closerToPredictedTarget =
            Math.hypot(coords2.x - prediction.x, coords2.y - prediction.y) -
            Math.hypot(coords1.x - prediction.x, coords1.y - prediction.y);

        return closerToPredictedTarget > 0.05
            ? closerToPredictedTarget
            : closerToColour(imageData, avgColour, bbox1, bbox2);
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
