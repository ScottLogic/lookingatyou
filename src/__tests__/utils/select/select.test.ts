import { IDetection } from '../../../models/objectDetection';
import select, {
    calculateColourMatch,
    closerToPrediction,
    getAvgColour,
    getPredictedColour,
    getPredictedTarget,
} from '../../../utils/objectSelection/select';

describe('colour match should return', () => {
    it('should return default for undefined imageData', () =>
        expect(calculateColourMatch(undefined, [])).toStrictEqual({
            r: 0,
            g: 0,
            b: 0,
        }));
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
