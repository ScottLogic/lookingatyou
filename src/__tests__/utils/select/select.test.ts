import { Keypoint } from '@tensorflow-models/posenet';
import { getImageData } from '../../../__test_utils__/getImageData';
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
const rightWrist = getPart(1, { x: 1, y: 0 }, 'rightWrist');
const leftWrist = getPart(1, { x: -1, y: 0 }, 'leftWrist');
const rightElbow = getPart(1, { x: 3, y: 0 }, 'rightElbow');
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

const furherAwayKeyoints = defaultKeypoints
    .splice(5, 1, getPart(1, { x: 0, y: -5 }, 'rightShoulder'))
    .splice(6, 1, getPart(1, { x: 5, y: -5 }, 'leftShoulder'));

const furtherAwayFromPredictionDetection: IDetection = {
    bbox: [15, 15, 5, 5],
    info: {
        score: 0.5,
        keypoints: furherAwayKeyoints,
    },
};

const imageData = getImageData(20, 20);

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
            ).toStrictEqual({ r: 200, g: 0, b: 106 });
        });
    });

    describe('getAvgColour', () => {
        const data = getImageData(2, 2);

        it('should return average value for correct data', () => {
            const result = getAvgColour(0, 0, 2, 2, data);
            expect(result).toStrictEqual({ r: 200, g: 0, b: 106 });
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
    const colour = { r: 0, g: 0, b: 0 };
    const data = getImageData(25, 25);

    it('should return positive for first arg better match', () => {
        expect(closerToColour(data, colour, points1, points2)).toBeGreaterThan(
            0,
        );
    });
});

describe('closerToPrediction', () => {
    const colour = { r: 200, g: 0, b: 106 };
    const prediction = { x: -0.5, y: -0.5 };
    it('should return positive for new better target', () => {
        expect(
            closerToPrediction(prediction, imageData, colour)(
                defaultDetection,
                furtherAwayFromPredictionDetection,
            ),
        ).toBeGreaterThan(0);
    });
    it('should return negative for new worse target', () => {
        expect(
            closerToPrediction(prediction, imageData, colour)(
                furtherAwayFromPredictionDetection,
                defaultDetection,
            ),
        ).toBeLessThan(0);
    });
});
