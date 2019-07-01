import { ICoords } from '../types';
import selectMatching from './selectMatching';
describe('selectMatching should return', () => {
    it('first right-eye coord when all right-eye coords are to the right of the left-eye coord', () => {
        const leftEyeCoord: ICoords = { x: 5, y: 50 };
        const rightEyeCoords: ICoords[] = [
            { x: 10, y: 20 },
            { x: 40, y: 5 },
            { x: 15, y: 40 },
        ];
        expect(selectMatching(leftEyeCoord, rightEyeCoords)).toStrictEqual(
            rightEyeCoords[0],
        );
    });
    it('of all the right-eye coords whose x-value is less than the x value of the left-eye coord, return that whose y-value is closest the y value of the left-eye coord', () => {
        const leftEyeCoord: ICoords = { x: 50, y: 325 };
        const rightEyeCoords: ICoords[] = [
            { x: 15, y: 333 },
            { x: 15, y: 320 },
            { x: 55, y: 40 },
            { x: 88, y: 20 },
            { x: 99, y: 5 },
            { x: 10, y: 95 },
        ];
        expect(selectMatching(leftEyeCoord, rightEyeCoords)).toStrictEqual({
            x: 15,
            y: 320,
        });
    });
});
