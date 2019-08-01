import { Keypoint } from '@tensorflow-models/posenet/dist/types';
import { IDetection } from '../../../models/objectDetection';
import {
    calculateColourMatch,
    closerToColour,
    closerToPrediction,
    getAvgColour,
    getPredictedColour,
    getPredictedTarget,
    leftOf,
    rightOf,
} from '../../../utils/objectSelection/select';
import { Bbox, ICoords } from '../../../utils/types';

const defaultBbox: Bbox = [0, 1, 1, 1];
const origin: ICoords = { x: 0, y: 0 };

const nose = getPart(1, origin, 'nose');
const leftEar = getPart(1, origin, 'leftEar');
const rightEar = getPart(1, origin, 'rightEar');
const leftHip = getPart(1, origin, 'leftHip');
const rightHip = getPart(1, origin, 'rightHip');
const leftKnee = getPart(1, origin, 'leftKnee');
const rightKnee = getPart(1, origin, 'rightKnee');
const leftAnkle = getPart(1, origin, 'leftAnkle');
const rightAnkle = getPart(1, origin, 'rightAnkle');
const rightWrist = getPart(1, { x: 0, y: 0 }, 'rightWrist');
const leftWrist = getPart(1, { x: 0, y: 0 }, 'leftWrist');
const rightElbow = getPart(1, { x: 0, y: 0 }, 'rightElbow');
const leftElbow = getPart(1, { x: 0, y: 0 }, 'leftElbow');
const rightShoulder = getPart(1, { x: 0, y: -5 }, 'rightShoulder');
const leftShoulder = getPart(1, { x: 5, y: -5 }, 'leftShoulder');
const rightEye = getPart(1, { x: 0, y: 0 }, 'rightEye');
const leftEye = getPart(1, { x: 0, y: 0 }, 'leftEye');

const defaultKeypoints: Keypoint[] = [
    nose,
    leftEye,
    rightEye,
    leftEar,
    rightEar,
    leftShoulder,
    rightShoulder,
    leftElbow,
    rightElbow,
    leftWrist,
    rightWrist,
    leftHip,
    rightHip,
    leftKnee,
    rightKnee,
    leftAnkle,
    rightAnkle,
];

export const defaultDetection: IDetection = {
    bbox: defaultBbox,
    info: {
        score: 1,
        keypoints: defaultKeypoints,
    },
};

export const furtherAwayKeyPoints = defaultKeypoints
    .splice(1, 1, getPart(1, { x: 10, y: 10 }, 'rightEye'))
    .splice(2, 1, getPart(1, { x: 10, y: 10 }, 'leftEye'));

export const furtherAwayFromPredictionDetection: IDetection = {
    ...defaultDetection,
    info: {
        score: 0.5,
        keypoints: furtherAwayKeyPoints,
    },
};

export const simulatedDetections = [];

export const imageData = getImageData();

function getImageData(): ImageData {
    const data = new Uint8ClampedArray(400);

    for (let i = 0; i < 400; i += 4) {
        data[i + 0] = 190; // R value
        data[i + 1] = 0; // G value
        data[i + 2] = i < 200 ? 210 : 0; // B value
        data[i + 3] = 255; // A value
    }

    return { data, width: 10, height: 10 };
}

function getPart(score: number, position: ICoords, part: string) {
    return {
        score,
        position,
        part,
    };
}

describe('objectSelection select', () => {
    describe('calculateColourMatch', () => {
        const result = calculateColourMatch([]);
        it('should return default for undefined imageData', () =>
            expect(result).toStrictEqual({ r: 0, g: 0, b: 0 }));

        it('should return average colour at those points', () => {
            expect(
                calculateColourMatch(
                    defaultDetection.info.keypoints,
                    imageData,
                ),
            ).toStrictEqual({ r: 189, g: 0, b: 208 });
        });
    });

    describe('getAvgColour', () => {
        const data = new Uint8ClampedArray(16);

        for (let i = 0; i < 16; i += 4) {
            data[i + 0] = 190; // R value
            data[i + 1] = 0; // G value
            data[i + 2] = 210; // B value
            data[i + 3] = 255; // A value
        }

        const image = { data, width: 2, height: 2 };

        it('should return average value for correct data', () => {
            const result = getAvgColour(0, 0, 2, 2, image);
            expect(result).toStrictEqual({ r: 189, g: 0, b: 208 });
        });
    });

    describe('getPredictedTarget', () => {
        const noHistory = [{ x: 0, y: 0 }];
        it('should return (0,0) for idle target', () => {
            expect(getPredictedTarget(noHistory)).toStrictEqual({ x: 0, y: 0 });
        });

        const oneAhead = [{ x: 0, y: 0 }, { x: 1, y: -1 }, { x: 2, y: -2 }];
        it('should return (3,-3) for increasing sequence', () => {
            expect(getPredictedTarget(oneAhead)).toStrictEqual({ x: 3, y: -3 });
        });
    });

    describe('getPredictedColour', () => {
        const noHistory = [{ r: 0, g: 0, b: 0 }];
        const result = getPredictedColour(noHistory);
        it('should return black on default history', () => {
            expect(result).toStrictEqual({ r: 0, g: 0, b: 0 });
        });

        const history = [{ r: 0, g: 0, b: 0 }, { r: 15, g: 15, b: 15 }];
        const historyResult = getPredictedColour(history);
        it('should return avgerage if there is history', () => {
            expect(historyResult).toStrictEqual({ r: 10, g: 10, b: 10 });
        });
    });

    describe('leftOf/rightOf', () => {
        it('leftOf/rightOf should be true/false', () => {
            expect(
                leftOf(Number.MAX_SAFE_INTEGER)(defaultDetection),
            ).toBeTruthy();
            expect(
                rightOf(Number.MAX_SAFE_INTEGER)(defaultDetection),
            ).toBeFalsy();
        });
        it('leftOf/rightOf should be false/true', () => {
            expect(
                leftOf(Number.MIN_SAFE_INTEGER)(defaultDetection),
            ).toBeFalsy();
            expect(
                rightOf(Number.MIN_SAFE_INTEGER)(defaultDetection),
            ).toBeTruthy();
        });
    });
});

describe('closerToColour', () => {
    const points1 = defaultDetection.info.keypoints;
    const points2 = furtherAwayFromPredictionDetection.info.keypoints;
    const colour = { r: 190, g: 0, b: 0 };

    it('should return positive for first arg better match', () => {
        expect(
            closerToColour(imageData, colour, points1, points2),
        ).toBeGreaterThan(0);
    });
});

describe('closerToPrediction', () => {
    const colour = { r: 188, g: 0, b: 0 };

    it('should return positive for new better target', () => {
        expect(
            closerToPrediction(origin, imageData, colour)(
                defaultDetection,
                furtherAwayFromPredictionDetection,
            ),
        ).toBeGreaterThan(0);
    });
    it('should return negative for new worse target', () => {
        expect(
            closerToPrediction(origin, imageData, colour)(
                furtherAwayFromPredictionDetection,
                defaultDetection,
            ),
        ).toBeLessThan(0);
    });
});
