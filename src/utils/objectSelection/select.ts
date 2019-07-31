import { Keypoint } from '@tensorflow-models/posenet';
import convert from 'color-convert';
import { bodyParts, colourCheckConsts } from '../../AppConstants';
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
    return undefined;
}

export function calculateColourMatch(
    imageData: ImageData | undefined,
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

export function getAvgColour(
    xStart: number,
    yStart: number,
    xEnd: number,
    yEnd: number,
    imageData: ImageData,
): IColour {
    let L = 0;
    let a = 0;
    let b = 0;

    const data = imageData.data;
    let counter = 0;
    for (
        let i = yStart * 4 * imageData.width;
        i < yEnd * 4 * imageData.width;
        i += imageData.width * 4
    ) {
        for (let j = xStart * 4; j < xEnd * 4; j += 4) {
            const imgR = data[j + i];
            const imgG = data[j + i + 1];
            const imgB = data[j + i + 2];
            const [pixelL, pixela, pixelb] = convert.rgb.lab([
                imgR,
                imgG,
                imgB,
            ]);
            L += pixelL;
            a += pixela;
            b += pixelb;
            counter++;
        }
    }

    L = L / counter;
    a = a / counter;
    b = b / counter;

    const [avgR, avgG, avgB] = convert.lab.rgb([L, a, b]);

    return { r: avgR, g: avgG, b: avgB };
}

export function getPredictedTarget(history: ICoords[]): ICoords {
    const normalisedXCoords = history.map(target => target.x);
    const normalisedYCoords = history.map(target => target.y);

    const xPrediction = getWeightedPrediction(normalisedXCoords);
    const yPrediction = getWeightedPrediction(normalisedYCoords);

    return { x: xPrediction, y: yPrediction };
}

export function getPredictedColour(history: IColour[]): IColour {
    const rHistory = history.map(colour => colour.r);
    const gHistory = history.map(colour => colour.g);
    const bHistory = history.map(colour => colour.b);

    const r = getWeightedAverage(rHistory);
    const g = getWeightedAverage(gHistory);
    const b = getWeightedAverage(bHistory);

    return { r, g, b };
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
    const x1Start = getXStart(keypoints1);
    const x2Start = getXStart(keypoints2);
    const x1End = x1Start + colourCheckConsts.xOffset;
    const x2End = x2Start + colourCheckConsts.xOffset;
    const y1Start = getYStart(keypoints1);
    const y2Start = getYStart(keypoints2);
    const y1End = y1Start + colourCheckConsts.yOffset;
    const y2End = y2Start + colourCheckConsts.yOffset;

    const box1AvgColour = getAvgColour(
        x1Start,
        y1Start,
        x1End,
        y1End,
        imageData,
    );
    const box2AvgColour = getAvgColour(
        x2Start,
        y2Start,
        x2End,
        y2End,
        imageData,
    );

    const box1GreenDelta = Math.pow(box1AvgColour.g - avgColour.g, 2);
    const box1BlueDelta = Math.pow(box1AvgColour.b - avgColour.b, 2);
    const box1RedDelta = Math.pow(box1AvgColour.r - avgColour.r, 2);
    const box2RedDelta = Math.pow(box2AvgColour.r - avgColour.r, 2);
    const box2GreenDelta = Math.pow(box2AvgColour.g - avgColour.g, 2);
    const box2BlueDelta = Math.pow(box2AvgColour.b - avgColour.b, 2);

    const box1Variance = box1RedDelta + box1GreenDelta + box1BlueDelta;
    const box2Variance = box2RedDelta + box2GreenDelta + box2BlueDelta;

    return box2Variance - box1Variance;
}

export function getXStart(keypoints: Keypoint[]) {
    const rightShoulder = keypoints.find(
        keypoint => keypoint.part === bodyParts.RIGHT_SHOULDER,
    );
    const leftShoulder = keypoints.find(
        keypoint => keypoint.part === bodyParts.LEFT_SHOULDER,
    );
    return leftShoulder && rightShoulder
        ? Math.abs(
              Math.round(
                  (leftShoulder.position.x - rightShoulder.position.x) / 2 +
                      rightShoulder.position.x,
              ) - 5,
          )
        : 0;
}

export function getYStart(keypoints: Keypoint[]) {
    const rightShoulder = keypoints.find(
        keypoint => keypoint.part === bodyParts.RIGHT_SHOULDER,
    );
    return rightShoulder
        ? Math.round(rightShoulder.position.y) + colourCheckConsts.yOffset
        : 0;
}

export function closerToPrediction(
    prediction: ICoords,
    imageData: ImageData,
    avgColour: IColour,
): (detection1: IDetection, detection2: IDetection) => number {
    return function closerToCoords(
        detection1: IDetection,
        detection2: IDetection,
    ) {
        const normalisedCoords1 = calculateNormalisedPos(
            detection1.bbox,
            imageData.width,
            imageData.height,
        );
        const normalisedCoords2 = calculateNormalisedPos(
            detection2.bbox,
            imageData.width,
            imageData.height,
        );

        const person2DistanceFromPrediction = Math.hypot(
            normalisedCoords2.x - prediction.x,
            normalisedCoords2.y - prediction.y,
        );
        const person1DistanceFromPrediction = Math.hypot(
            normalisedCoords1.x - prediction.x,
            normalisedCoords1.y - prediction.y,
        );

        const closerToPredictedTarget =
            person2DistanceFromPrediction - person1DistanceFromPrediction;

        return person1DistanceFromPrediction > 0.2 ||
            person2DistanceFromPrediction > 0.2
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
    if (nums.length === 1) {
        return nums[0];
    }
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

function getWeightedAverage(nums: number[]): number {
    nums = nums.reverse();
    const weightedNums = [];
    let decayTotal = 0;

    for (let i = 0; i < nums.length; i++) {
        const decay = Math.pow(0.5, i);
        weightedNums.push(nums[i] * decay);
        decayTotal += decay;
    }

    return weightedNums.reduce((a, b) => a + b, 0) / decayTotal;
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
