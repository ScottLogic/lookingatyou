import { IDetection } from '../../../models/objectDetection';
import select, {
    closerToPrediction,
} from '../../../utils/objectSelection/select';
import { Bbox } from '../../../utils/types';
describe('selectClosest', () => {
    it('return undefined for no  detections', () => {
        const selectClosest: (ds: IDetection[]) => Bbox | undefined = ds =>
            select(ds, closerToPrediction({ x: 0, y: 0 }, 640, 480));
        const detections: IDetection[] = [];
        expect(selectClosest(detections)).toBe(undefined);
    });
    it('return bounding box closest to point', () => {
        const info = { score: 0, keypoints: [] };
        const detections: IDetection[] = [
            {
                bbox: [160, 20, 0, 450],
                info,
            },
            {
                bbox: [10, 206, 0, 40],
                info,
            },
            {
                bbox: [100, 20, 50, 0],
                info,
            },
            {
                bbox: [120, 2300, 0, 70],
                info,
            },
            {
                bbox: [300, 290, 360, 0],
                info,
            },
            {
                bbox: [10, 550, 0, 0],
                info,
            },
            {
                bbox: [10, 50, 10, 110],
                info,
            },
            {
                bbox: [305, 295, 5, 5],
                info,
            },
            {
                bbox: [320, 200, 0, 80],
                info,
            },
        ];
        const selectClosest: (ds: IDetection[]) => Bbox | undefined = ds =>
            select(ds, closerToPrediction({ x: 0, y: 0 }, 640, 480));
        expect(selectClosest(detections)).toStrictEqual([320, 200, 0, 80]);
    });
});
