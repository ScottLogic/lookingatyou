import * as ssd from '@tensorflow-models/coco-ssd';
import { IDetection, IObjectDetector } from '../../models/objectDetection';
import CocoSSD from '../../utils/objectDetection/cocoSSD';
import { Bbox } from '../../utils/types';

const testBbox: Bbox = [1, 2, 3, 4];
const testType: string = 'person';
const testScore: number = 50;

const testInput: ssd.DetectedObject[] = [
    {
        bbox: testBbox,
        class: testType,
        score: testScore,
    },
];

const testOutput: IDetection[] = [
    {
        bbox: testBbox,
        info: { type: testType, certainty: testScore },
    },
];

describe('CocoSSD', () => {
    let testCoco: IObjectDetector;
    beforeAll(async () => {
        testCoco = await CocoSSD.init();
    }, 60000);

    it('model should load successfully', () => {
        expect(testCoco).toBeInstanceOf(CocoSSD);
    });

    it('shapeDetect should return object of shape IDetection', () => {
        expect(testCoco.reshapeDetections(testInput)).toStrictEqual(testOutput);
    });
});
