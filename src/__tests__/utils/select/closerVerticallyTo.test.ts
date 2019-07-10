import { Detection, DetectionModelType } from '../../../models/objectDetection';
import { Bbox } from '../../types';
import matchYPosition from './matchYPosition';
const personInfo = {
    info: { certainty: 1, type: 'person' },
};
const nonPersonInfo = {
    info: { certainty: 1, type: 'non-person' },
};
describe('selectMatching should return', () => {
    it('undefined when all right-eye coords are to the left of the left-eye coord', () => {
        const leftEyeSelection: Bbox = [5, 50, 0, 0];
        const rightEyeDetections: Detection[] = [
            {
                bbox: [-10, 20, 0, 0],
                model: DetectionModelType.CocoSSD,
                ...personInfo,
            },
            {
                bbox: [-40, 5, 0, 0],
                model: DetectionModelType.CocoSSD,
                ...personInfo,
            },
            {
                bbox: [-16, 20, 0, 0],
                model: DetectionModelType.CocoSSD,
                ...nonPersonInfo,
            },
        ];
        expect(matchYPosition(rightEyeDetections)).toBe(undefined);
    });
    it('of all the right-eye coords (that are persons) whose x-value is greater than the x value of the left-eye coord, return that whose y-value is closest the y value of the left-eye coord', () => {
        const leftEyeSelection: Bbox = [50, 325, 0, 0];
        const rightEyeDetections: Detection[] = [
            {
                bbox: [10, 20, 0, 0],
                model: DetectionModelType.CocoSSD,
                ...nonPersonInfo,
            },
            {
                bbox: [40, 5, 0, 0],
                model: DetectionModelType.CocoSSD,
                ...nonPersonInfo,
            },
            {
                bbox: [15, 40, 0, 0],
                model: DetectionModelType.CocoSSD,
                ...nonPersonInfo,
            },
            {
                bbox: [15, 333, 0, 0],
                model: DetectionModelType.CocoSSD,
                ...personInfo,
            },
            {
                bbox: [15, 320, 0, 0],
                model: DetectionModelType.CocoSSD,
                ...personInfo,
            },
            {
                bbox: [55, 40, 0, 0],
                model: DetectionModelType.CocoSSD,
                ...personInfo,
            },
            {
                bbox: [16, 20, 0, 0],
                model: DetectionModelType.CocoSSD,
                ...nonPersonInfo,
            },
            {
                bbox: [50, 325, 0, 0],
                model: DetectionModelType.CocoSSD,
                ...nonPersonInfo,
            },
            {
                bbox: [11, 40, 0, 0],
                model: DetectionModelType.CocoSSD,
                ...personInfo,
            },
            {
                bbox: [88, 20, 0, 0],
                model: DetectionModelType.CocoSSD,
                ...personInfo,
            },
            {
                bbox: [99, 5, 0, 0],
                model: DetectionModelType.CocoSSD,
                ...personInfo,
            },
            {
                bbox: [10, 95, 0, 0],
                model: DetectionModelType.CocoSSD,
                ...personInfo,
            },
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
