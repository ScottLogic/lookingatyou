import { DetectedObject } from '@tensorflow-models/coco-ssd';
import { Detection, DetectionModelType } from '../../models/objectDetection';
import CocoSSD from '../../utils/objectDetection/cocoSSD';
import { Bbox } from '../../utils/types';

const testBbox: Bbox = [1, 2, 3, 4];
const testType: string = 'person';
const testScore: number = 50;

const testInput: DetectedObject[] = [
    {
        bbox: testBbox,
        class: testType,
        score: testScore,
    },
];

const testOutput: Detection[] = [
    {
        model: DetectionModelType.CocoSSD,
        bbox: testBbox,
        info: { type: testType, certainty: testScore },
    },
];

describe('CocoSSD', () => {
    it('shapeDetect should return object of shape Detection', () => {
        expect(CocoSSD.reshapeDetections(testInput)).toStrictEqual(testOutput);
    });
});
