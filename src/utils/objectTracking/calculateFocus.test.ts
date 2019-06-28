import { ICoords } from '../interfaces';
import { Bbox } from '../types';
import calculateTargetPos, { normalise } from './calculateFocus';

describe('normalise should return', () => {
    it('arg:newMin if arg:val equals arg:min', () => {
        // Testing defaults
        expect(normalise(0, 1)).toBe(-1);
        expect(normalise(0, 12345)).toBe(-1);

        // Testing defaults with custom min
        expect(normalise(-42, -10, -42)).toBe(-1);
        expect(normalise(324, 1000, 324)).toBe(-1);

        // Testing custom newMin
        expect(normalise(-8, -4, -8, 500, 400)).toBe(400);
    });
    it('arg:newMax if arg:val equals arg.max', () => {
        // Testing defaults
        expect(normalise(1, 1)).toBe(1);
        expect(normalise(12345, 12345)).toBe(1);

        // Testing custom newMax
        expect(normalise(-42, -42, -50, 500, 400)).toBe(500);
    });
    it('the correct normalised number between arg:newMin and arg:newMax for any arg:val between arg:min and arg:max', () => {
        // Testing default use case for center
        expect(normalise(320, 640)).toBeCloseTo(0);

        // Testing default use case
        expect(normalise(234, 640)).toBeCloseTo(-0.26875);
        expect(normalise(390, 480)).toBeCloseTo(0.625);

        // Testing arbitrary normalise
        expect(normalise(276, 1898, -425, 100, 0)).toBeCloseTo(30.17649591);
    });
});

describe('calculateTargetPos should return', () => {
    const testValues: Array<[Bbox, ICoords]> = [
        [[0, 0, 10, 20], { x: 5, y: 15 }],
        [[50, 800, 100, 200], { x: 100, y: 950 }],
        [[42, 21, 0, 0], { x: 42, y: 21 }],
    ];
    it.each(testValues)(
        'an ICoord object centered in middle of the arg:bbox, 3/4 from the bottom',
        (bbox: Bbox, expected: ICoords) => {
            const coords = calculateTargetPos(bbox);
            expect(coords).toBeDefined();
            if (coords) {
                expect(coords.x).toBeCloseTo(expected.x);
                expect(coords.y).toBeCloseTo(expected.y);
            }
        },
    );
    it('undefined if bbox is undefined', () => {
        expect(calculateTargetPos(undefined)).toBeUndefined();
    });
});
