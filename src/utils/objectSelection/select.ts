import { Keypoint } from '@tensorflow-models/posenet';
import { bodyParts } from '../../AppConstants';
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
    compare: (detection1: IDetection, detection2: IDetection) => number,
    filter?: (d: IDetection) => boolean,
): Bbox | undefined {
    const filteredDetections: IDetection[] = detections.filter(
        detection => !filter || filter(detection),
    );

    const selectedDetection = filteredDetections.reduce<IDetection | undefined>(
        (best, current) =>
            best === undefined || compare(current, best) > 0 ? current : best,
        undefined,
    );

    if (selectedDetection) {
        return selectedDetection.bbox;
    }
}

export function calculateColourMatch(
    imageData: ImageData,
    keypoints: Keypoint[],
): IColour {
    if (!imageData) {
        return { r: 0, g: 0, b: 0 };
    }

    const xStart = getXStart(keypoints, imageData.width);
    const yStart = getYStart(keypoints, imageData.height);
    const xEnd = getXEnd(keypoints, imageData.width);
    const yEnd = getYEnd(keypoints, imageData.height);

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
    for (
        let i = yStart;
        i < yEnd * 4 * imageData.width;
        i += imageData.width * 4
    ) {
        for (let j = xStart; j < xEnd * 4; j += 4) {
            r = imageData.data[j + i];
            g = imageData.data[j + i + 1];
            b = imageData.data[j + i + 2];
            counter++;
        }
    }
    r = r / counter;
    g = g / counter;
    b = b / counter;

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

    const x1Start = getXStart(keypoints1, imageData.width);
    const x2Start = getXStart(keypoints2, imageData.width);
    const x1End = getXEnd(keypoints1, imageData.width);
    const x2End = getXEnd(keypoints2, imageData.width);
    const y1Start = getYStart(keypoints1, imageData.height);
    const y2Start = getYStart(keypoints2, imageData.height);
    const y1End = getYEnd(keypoints1, imageData.height);
    const y2End = getYEnd(keypoints2, imageData.height);

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

function getXStart(keypoints: Keypoint[], width: number) {
    const rightShoulder = keypoints.filter(
        keypoint => keypoint.part === bodyParts.RIGHT_SHOULDER,
    )[0];
    return rightShoulder ? Math.round(rightShoulder.position.x - width / 2) : 0;
}

function getXEnd(keypoints: Keypoint[], width: number) {
    const leftShoulder = keypoints.filter(
        keypoint => keypoint.part === bodyParts.LEFT_SHOULDER,
    )[0];
    return leftShoulder ? Math.round(leftShoulder.position.x - width / 2) : 0;
}

function getYStart(keypoints: Keypoint[], height: number) {
    const rightShoulder = keypoints.filter(
        keypoint => keypoint.part === bodyParts.RIGHT_SHOULDER,
    )[0];
    return rightShoulder
        ? Math.round(rightShoulder.position.y - height / 2)
        : 0;
}

function getYEnd(keypoints: Keypoint[], height: number) {
    const rightHip = keypoints.filter(
        keypoint => keypoint.part === bodyParts.RIGHT_HIP,
    )[0];
    return rightHip ? Math.round(rightHip.position.x - height / 2) : 0;
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

        return closerToPredictedTarget > 0.05
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

export function first(bbox1: Bbox, bbox2: Bbox): number {
    return 0;
}
