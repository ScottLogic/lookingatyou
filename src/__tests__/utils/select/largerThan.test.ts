import { IDetection } from '../../../models/objectDetection';
import select, { largerThan } from '../../../utils/objectSelection/select';
import { Bbox } from '../../../utils/types';
describe('selectLargest', () => {
    const selectLargest: (
        detections: IDetection[],
    ) => Bbox | undefined = detections => select(detections, largerThan);

    it('return undefined for no detections', () => {
        const detections: IDetection[] = [];
        expect(selectLargest(detections)).toBe(undefined);
    });
    it('return largest bounding box', () => {
        const pose = { score: 0, keypoints: [] };
        const detections: IDetection[] = [
            {
                bbox: [160, 20, 340, 400],
                info: pose,
            },
            {
                bbox: [10, 206, 53, 200],
                info: pose,
            },
            {
                bbox: [10, 20, 1000, 999],
                info: pose,
            },
            {
                bbox: [10, 200, 53, 4],
                info: pose,
            },
            {
                bbox: [0, 20, 3000, 3000],
                info: pose,
            },
            {
                bbox: [10, 0, 30, 1],
                info: pose,
            },
            {
                bbox: [10, 0, 1000, 1000],
                info: pose,
            },
            {
                bbox: [0, 20, 30, 400],
                info: pose,
            },
            {
                bbox: [0, 0, 30, 400],
                info: pose,
            },
        ];
        expect(selectLargest(detections)).toStrictEqual([0, 20, 3000, 3000]);
    });
});
