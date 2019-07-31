import { IDetection } from '../../../models/objectDetection';
import {
    detection1,
    detection2,
} from '../../../test_constants/selectConstants';
import select, {
    calculateColourMatch,
    closerToColour,
    closerToPrediction,
    getAvgColour,
    getPredictedColour,
    getPredictedTarget,
    leftOf,
    rightOf,
} from '../../../utils/objectSelection/select';

describe('colour match should return', () => {
    const data = new Uint8ClampedArray(1382400);

    for (let i = 0; i < 1382400; i += 4) {
        data[i + 0] = 190; // R value
        data[i + 1] = 0; // G value
        data[i + 2] = i < 691200 ? 210 : 0; // B value
        data[i + 3] = 255; // A value
    }

    const imageData = { data, width: 720, height: 480 };

    it('should return default for undefined imageData', () =>
        expect(calculateColourMatch(undefined, [])).toStrictEqual({
            r: 0,
            g: 0,
            b: 0,
        }));
    it('should return average colour at those points', () => {
        expect(
            calculateColourMatch(imageData, detection1.info.keypoints),
        ).toStrictEqual({ r: 188, g: 0, b: 0 });
    });
});

describe('getAvgColour should return', () => {
    const data = new Uint8ClampedArray(400);

    for (let i = 0; i < 400; i += 4) {
        data[i + 0] = 190; // R value
        data[i + 1] = 0; // G value
        data[i + 2] = 210; // B value
        data[i + 3] = 255; // A value
    }

    const imageData = { data, width: 10, height: 10 };

    it('should return value for correct data', () => {
        expect(getAvgColour(0, 0, 10, 10, imageData)).toStrictEqual({
            r: 189,
            g: 0,
            b: 208,
        });
    });
});

describe('getPredictedTarget should return', () => {
    const noHistory = [{ x: 0, y: 0 }];
    it('should return (0,0) for idle target', () => {
        expect(getPredictedTarget(noHistory)).toStrictEqual({ x: 0, y: 0 });
    });

    const oneAhead = [{ x: 0, y: 0 }, { x: 1, y: -1 }, { x: 2, y: -2 }];
    it('should return (3,-3) for increasing sequence', () => {
        expect(getPredictedTarget(oneAhead)).toStrictEqual({ x: 3, y: -3 });
    });
});

describe('getPredictedColour should return', () => {
    const noHistory = [{ r: 0, g: 0, b: 0 }];
    it('should return black', () => {
        expect(getPredictedColour(noHistory)).toStrictEqual({
            r: 0,
            g: 0,
            b: 0,
        });
    });

    const history = [{ r: 0, g: 0, b: 0 }, { r: 15, g: 15, b: 15 }];
    it('should return avgerage', () => {
        expect(getPredictedColour(history)).toStrictEqual({
            r: 10,
            g: 10,
            b: 10,
        });
    });
});

describe('leftOf/rightOf should return', () => {
    it('leftOf/rightOf should be true/false', () => {
        expect(leftOf(Number.MAX_SAFE_INTEGER)(detection1)).toBeTruthy();
        expect(rightOf(Number.MAX_SAFE_INTEGER)(detection1)).toBeFalsy();
    });
    it('leftOf/rightOf should be false/true', () => {
        expect(leftOf(Number.MIN_SAFE_INTEGER)(detection1)).toBeFalsy();
        expect(rightOf(Number.MIN_SAFE_INTEGER)(detection1)).toBeTruthy();
    });
});

describe('closerToColour should return', () => {
    const data = new Uint8ClampedArray(1382400);

    for (let i = 0; i < 1382400; i += 4) {
        data[i + 0] = 190; // R value
        data[i + 1] = 0; // G value
        data[i + 2] = i < 691200 ? 210 : 0; // B value
        data[i + 3] = 255; // A value
    }

    const imageData = { data, width: 720, height: 480 };
    const points1 = detection1.info.keypoints;
    const points2 = detection2.info.keypoints;
    const colour = { r: 190, g: 0, b: 0 };

    it('should return positive for first arg better match', () => {
        expect(
            closerToColour(imageData, colour, points1, points2),
        ).toBeGreaterThan(0);
    });
});

describe('closerToPrediction should return', () => {
    const data = new Uint8ClampedArray(86400);

    for (let i = 0; i < 86400; i += 4) {
        data[i + 0] = 190; // R value
        data[i + 1] = 0; // G value
        data[i + 2] = i < 43200 ? 210 : 0; // B value
        data[i + 3] = 255; // A value
    }

    const imageData = { data, width: 360, height: 240 };
    const origin = { x: 0, y: 0 };
    const colour = { r: 190, g: 0, b: 0 };

    it('should return positive for new better target', () => {
        expect(
            closerToPrediction(origin, imageData, colour)(
                detection2,
                detection1,
            ),
        ).toBeGreaterThan(0);
    });
    it('should return negative for new worse target', () => {
        expect(
            closerToPrediction(origin, imageData, colour)(
                detection1,
                detection2,
            ),
        ).toBeLessThan(0);
    });
});
