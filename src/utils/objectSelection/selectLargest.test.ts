import { IDetection } from '../../models/objectDetection';
import selectLargest from './selectLargest';
describe('selectLargest', () => {
    it('return undefined for no  detections', () => {
        const detections: IDetection[] = [];
        expect(selectLargest(detections)).toBe(undefined);
    });
    it('return undefined for no person detections', () => {
        const detections: IDetection[] = [
            {
                bbox: [10, 20, 30, 400],
                info: { type: 'giraffe', certainty: 100 },
            },
        ];
        expect(selectLargest(detections)).toBe(undefined);
    });
    it('return largest bounding box that belongs to a person', () => {
        const detections: IDetection[] = [
            {
                bbox: [160, 20, 340, 400],
                info: { type: 'person', certainty: 100 },
            },
            {
                bbox: [10, 206, 53, 200],
                info: { type: 'person', certainty: 100 },
            },
            {
                bbox: [10, 20, 1000, 999],
                info: { type: 'person', certainty: 100 },
            },
            {
                bbox: [10, 200, 53, 4],
                info: { type: 'person', certainty: 100 },
            },
            {
                bbox: [0, 20, 3000, 3000],
                info: { type: 'giraffe', certainty: 100 },
            },
            {
                bbox: [10, 0, 30, 1],
                info: { type: 'person', certainty: 100 },
            },
            {
                bbox: [10, 0, 1000, 1000],
                info: { type: 'person', certainty: 100 },
            },
            {
                bbox: [0, 20, 30, 400],
                info: { type: 'person', certainty: 100 },
            },
            {
                bbox: [0, 0, 30, 400],
                info: { type: 'person', certainty: 100 },
            },
        ];
        expect(selectLargest(detections)).toStrictEqual([10, 0, 1000, 1000]);
    });
});
