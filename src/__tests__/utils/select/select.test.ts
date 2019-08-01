import {
    detection1,
    detection2,
    imageData,
} from '../../../test_constants/selectConstants';
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

describe('utils', () => {
    describe('calculateColourMatch', () => {
        const result = calculateColourMatch([]);
        it('should return default for undefined imageData', () =>
            expect(result).toStrictEqual({ r: 0, g: 0, b: 0 }));

        it('should return average colour at those points', () => {
            expect(
                calculateColourMatch(detection1.info.keypoints, imageData),
            ).toStrictEqual({ r: 188, g: 0, b: 0 });
        });
    });

    describe('getAvgColour', () => {
        const data = new Uint8ClampedArray(400);

        for (let i = 0; i < 400; i += 4) {
            data[i + 0] = 190; // R value
            data[i + 1] = 0; // G value
            data[i + 2] = 210; // B value
            data[i + 3] = 255; // A value
        }

        const image = { data, width: 10, height: 10 };

        it('should return average value for correct data', () => {
            const result = getAvgColour(0, 0, 10, 10, image);
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
            expect(leftOf(Number.MAX_SAFE_INTEGER)(detection1)).toBeTruthy();
            expect(rightOf(Number.MAX_SAFE_INTEGER)(detection1)).toBeFalsy();
        });
        it('leftOf/rightOf should be false/true', () => {
            expect(leftOf(Number.MIN_SAFE_INTEGER)(detection1)).toBeFalsy();
            expect(rightOf(Number.MIN_SAFE_INTEGER)(detection1)).toBeTruthy();
        });
    });
});

describe('closerToColour', () => {
    const points1 = detection1.info.keypoints;
    const points2 = detection2.info.keypoints;
    const colour = { r: 190, g: 0, b: 0 };

    it('should return positive for first arg better match', () => {
        expect(
            closerToColour(imageData, colour, points1, points2),
        ).toBeGreaterThan(0);
    });
});

describe('closerToPrediction', () => {
    const origin = { x: 0, y: 0 };
    const colour = { r: 188, g: 0, b: 0 };

    it('should return positive for new better target', () => {
        expect(
            closerToPrediction(origin, imageData, colour)(
                detection1,
                detection2,
            ),
        ).toBeGreaterThan(0);
    });
    it('should return negative for new worse target', () => {
        expect(
            closerToPrediction(origin, imageData, colour)(
                detection2,
                detection1,
            ),
        ).toBeLessThan(0);
    });
});
