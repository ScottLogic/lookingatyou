import { IDetection } from '../../../models/objectDetection';
import { ICoords } from '../../types';
import matchYPosition from './matchYPosition';
const personInfo = { certainty: 1, type: 'person' };
const nonPersonInfo = { certainty: 1, type: 'non-person' };
describe('selectMatching should return', () => {
    it('null when all right-eye coords are to the left of the left-eye coord', () => {
        const leftEyeCoord: ICoords = { x: 5, y: 50 };
        const rightEyeDetections: IDetection[] = [
            { bbox: [-10, 20, 0, 0], info: personInfo },
            { bbox: [-40, 5, 0, 0], info: personInfo },
            { bbox: [-16, 20, 0, 0], info: nonPersonInfo },
        ];
        expect(matchYPosition(leftEyeCoord, rightEyeDetections)).toBe(null);
    });
    it('of all the right-eye coords (that are persons) whose x-value is greater than the x value of the left-eye coord, return that whose y-value is closest the y value of the left-eye coord', () => {
        const leftEyeCoord: ICoords = { x: 50, y: 325 };
        const rightEyeDetections: IDetection[] = [
            { bbox: [10, 20, 0, 0], info: nonPersonInfo },
            { bbox: [40, 5, 0, 0], info: nonPersonInfo },
            { bbox: [15, 40, 0, 0], info: nonPersonInfo },
            { bbox: [15, 333, 0, 0], info: personInfo },
            { bbox: [15, 320, 0, 0], info: personInfo },
            { bbox: [55, 40, 0, 0], info: personInfo },
            { bbox: [16, 20, 0, 0], info: nonPersonInfo },
            { bbox: [50, 325, 0, 0], info: nonPersonInfo },
            { bbox: [11, 40, 0, 0], info: personInfo },
            { bbox: [88, 20, 0, 0], info: personInfo },
            { bbox: [99, 5, 0, 0], info: personInfo },
            { bbox: [10, 95, 0, 0], info: personInfo },
        ];
        expect(matchYPosition(leftEyeCoord, rightEyeDetections)).toStrictEqual({
            x: 55,
            y: 40,
        });
    });
});
