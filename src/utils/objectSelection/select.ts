import { Keypoint } from '@tensorflow-models/posenet';
import { bodyParts } from '../../AppConstants';
import { Detections, IDetection } from '../../models/objectDetection';
import calculateTargetPos, {
    calculateNormalisedPos,
} from '../objectTracking/calculateFocus';
import { IColour, ICoords } from '../types';

export default function select(
    detections: Detections,
    compare: (x: IDetection, y: IDetection) => number,
    filter?: (d: IDetection) => boolean,
): IDetection | undefined {
    const personBboxes: Detections = detections.filter(
        detection => !filter || filter(detection),
    );

    const selectedDetection = personBboxes.reduce<IDetection | undefined>(
        (best, current) =>
            best === undefined || compare(current, best) > 0 ? current : best,
        undefined,
    );

    if (selectedDetection) {
        return selectedDetection;
    }
}

export function calculateColourMatch(
    imageData: ImageData,
    keypoints: Keypoint[],
): IColour {
    if (!imageData) {
        return { r: 0, g: 0, b: 0 };
    }

    const xStart = getXStart(keypoints);
    const yStart = getYStart(keypoints);
    const xEnd = xStart + 10;
    const yEnd = yStart + 10;

    return getAvgColour(xStart, yStart, xEnd, yEnd, imageData);
}

function getAvgColour(
    xStart: number,
    yStart: number,
    xEnd: number,
    yEnd: number,
    imageData: ImageData,
): { r: number; g: number; b: number } {
    if (!imageData) {
        return { r: 0, g: 0, b: 0 };
    }

    let r = 0;
    let g = 0;
    let b = 0;
    let counter = 0;
    const data = imageData.data;
    for (
        let i = yStart;
        i < yEnd * 4 * imageData.width;
        i += imageData.width * 4
    ) {
        for (let j = xStart; j < xEnd * 4; j += 4) {
            r = data[j + i];
            g = data[j + i + 1];
            b = data[j + i + 2];
            counter++;
        }
    }
    r = r / counter;
    g = g / counter;
    b = b / counter;

    return { r, g, b };
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

export function largerThan(
    detection1: IDetection,
    detection2: IDetection,
): number {
    return (
        detection1.bbox[2] * detection1.bbox[3] -
        detection2.bbox[2] * detection2.bbox[3]
    );
}

export function closerToColour(
    imageData: ImageData,
    avgColour: IColour,
    keypoints1: Keypoint[],
    keypoints2: Keypoint[],
): number {
    if (!imageData) {
        return 0;
    }

    const x1Start = getXStart(keypoints1);
    const x2Start = getXStart(keypoints2);
    const x1End = x1Start + 10;
    const x2End = x2Start + 10;
    const y1Start = getYStart(keypoints1);
    const y2Start = getYStart(keypoints2);
    const y1End = y1Start + 10;
    const y2End = y2Start + 10;

    const bbox1AvgColour = getAvgColour(
        x1Start,
        y1Start,
        x1End,
        y1End,
        imageData,
    );
    const bbox2AvgColour = getAvgColour(
        x2Start,
        y2Start,
        x2End,
        y2End,
        imageData,
    );

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

function getXStart(keypoints: Keypoint[]) {
    const rightShoulder = keypoints.filter(
        keypoint => keypoint.part === bodyParts.RIGHT_SHOULDER,
    )[0];
    const leftShoulder = keypoints.filter(
        keypoint => keypoint.part === bodyParts.LEFT_SHOULDER,
    )[0];
    return leftShoulder && rightShoulder
        ? Math.abs(
              Math.round(leftShoulder.position.x - rightShoulder.position.x),
          )
        : 0;
}

function getYStart(keypoints: Keypoint[]) {
    const rightShoulder = keypoints.filter(
        keypoint => keypoint.part === bodyParts.RIGHT_SHOULDER,
    )[0];
    return rightShoulder ? Math.round(rightShoulder.position.y) : 0;
}

export function closerToPrediction(
    prediction: ICoords,
    videoWidth: number,
    videoHeight: number,
    imageData: ImageData,
    avgColour: IColour,
): (detection1: IDetection, detection2: IDetection) => number {
    return function closerToCoords(
        detection1: IDetection,
        detection2: IDetection,
    ) {
        const coords1 = calculateNormalisedPos(
            detection1.bbox,
            videoWidth,
            videoHeight,
        );
        const coords2 = calculateNormalisedPos(
            detection2.bbox,
            videoWidth,
            videoHeight,
        );
        const closerToPredictedTarget =
            Math.hypot(coords2.x - prediction.x, coords2.y - prediction.y) -
            Math.hypot(coords1.x - prediction.x, coords1.y - prediction.y);

        return Math.abs(closerToPredictedTarget) < 0.1
            ? closerToPredictedTarget
            : closerToColour(
                  imageData,
                  avgColour,
                  detection1.info.keypoints,
                  detection2.info.keypoints,
              );
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
): (detection1: IDetection, detection2: IDetection) => number {
    return function closerToCoords(
        detection1: IDetection,
        detection2: IDetection,
    ) {
        return (
            Math.abs(calculateTargetPos(detection2.bbox).y - y) -
            Math.abs(calculateTargetPos(detection1.bbox).y - y)
        );
    };
}

export function first(detection1: IDetection, detection2: IDetection): number {
    return 0;
}
