import {
    Detection,
    DetectionModelType,
    ICocoSSDDetection,
} from '../../../models/objectDetection';
import select, { closerTo } from '../../../utils/objectSelection/select';
import { Bbox } from '../../../utils/types';
describe('selectClosest', () => {
    it('return undefined for no  detections', () => {
        const selectClosest: (ds: Detection[]) => Bbox | undefined = ds =>
            select(ds, true, closerTo());
        const detections: Detection[] = [];
        expect(selectClosest(detections)).toBe(undefined);
    });
    it('return undefined for no person detections', () => {
        const selectClosest: (ds: Detection[]) => Bbox | undefined = ds =>
            select(ds, true, closerTo());
        const detections: ICocoSSDDetection[] = [
            {
                model: DetectionModelType.CocoSSD,
                bbox: [10, 20, 30, 400],
                info: { type: 'giraffe', certainty: 100 },
            },
        ];
        expect(selectClosest(detections)).toBe(undefined);
    });
    it('return bounding box closest to point', () => {
        const detections: ICocoSSDDetection[] = [
            {
                model: DetectionModelType.CocoSSD,
                bbox: [160, 20, 0, 450],
                info: { type: 'person', certainty: 100 },
            },
            {
                model: DetectionModelType.CocoSSD,
                bbox: [10, 206, 0, 40],
                info: { type: 'person', certainty: 100 },
            },
            {
                model: DetectionModelType.CocoSSD,
                bbox: [100, 20, 50, 0],
                info: { type: 'person', certainty: 100 },
            },
            {
                model: DetectionModelType.CocoSSD,
                bbox: [120, 2300, 0, 70],
                info: { type: 'person', certainty: 100 },
            },
            {
                model: DetectionModelType.CocoSSD,
                bbox: [300, 290, 360, 0],
                info: { type: 'giraffe', certainty: 100 },
            },
            {
                model: DetectionModelType.CocoSSD,
                bbox: [10, 550, 0, 0],
                info: { type: 'person', certainty: 100 },
            },
            {
                model: DetectionModelType.CocoSSD,
                bbox: [10, 50, 10, 110],
                info: { type: 'person', certainty: 100 },
            },
            {
                model: DetectionModelType.CocoSSD,
                bbox: [305, 295, 5, 5],
                info: { type: 'person', certainty: 100 },
            },
            {
                model: DetectionModelType.CocoSSD,
                bbox: [0, 0, 0, 110],
                info: { type: 'person', certainty: 100 },
            },
        ];
        const selectClosest: (ds: Detection[]) => Bbox | undefined = ds =>
            select(ds, true, closerTo());
        expect(selectClosest(detections)).toStrictEqual([0, 0, 0, 110]);
    });
});
