import { IDetection } from '../../../models/objectDetection';
import select, {
    closerVerticallyTo,
    rightOf,
} from '../../../utils/objectSelection/select';
const personInfo = { certainty: 1, type: 'person' };
const nonPersonInfo = { certainty: 1, type: 'non-person' };
describe('selectMatching should return', () => {
    it('undefined when all right-eye coords are to the left of the left-eye coord', () => {
        const matchYPosition = (detections: IDetection[]) =>
            select(detections, closerVerticallyTo(50), rightOf(5));

        const rightEyeDetections: IDetection[] = [
            { bbox: [-10, 20, 0, 0], ...personInfo },
            { bbox: [-40, 5, 0, 0], ...personInfo },
            { bbox: [-16, 20, 0, 0], ...nonPersonInfo },
        ];
        expect(matchYPosition(rightEyeDetections)).toBe(undefined);
    });
    it('of all the right-eye coords (that are persons) whose x-value is greater than the x value of the left-eye coord, return that whose y-value is closest the y value of the left-eye coord', () => {
        const matchYPosition = (detections: IDetection[]) =>
            select(detections, closerVerticallyTo(325), rightOf(50));
        const rightEyeDetections: IDetection[] = [
            { bbox: [10, 20, 0, 0], ...nonPersonInfo },
            { bbox: [40, 5, 0, 0], ...nonPersonInfo },
            { bbox: [15, 40, 0, 0], ...nonPersonInfo },
            { bbox: [15, 333, 0, 0], ...personInfo },
            { bbox: [15, 320, 0, 0], ...personInfo },
            { bbox: [55, 40, 0, 0], ...personInfo },
            { bbox: [16, 20, 0, 0], ...nonPersonInfo },
            { bbox: [50, 325, 0, 0], ...nonPersonInfo },
            { bbox: [11, 40, 0, 0], ...personInfo },
            { bbox: [88, 20, 0, 0], ...personInfo },
            { bbox: [99, 5, 0, 0], ...personInfo },
            { bbox: [10, 95, 0, 0], ...personInfo },
        ];
        expect(matchYPosition(rightEyeDetections)).toStrictEqual([
            55,
            40,
            0,
            0,
        ]);
    });

    it('undefined when there are no detections', () => {
        const matchYPosition = (detections: IDetection[]) =>
            select(detections, closerVerticallyTo(325), rightOf(50));
        expect(matchYPosition([])).toBe(undefined);
    });
});
