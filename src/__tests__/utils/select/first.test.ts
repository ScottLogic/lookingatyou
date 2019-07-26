import { IDetection } from '../../../models/objectDetection';
import select, { first } from '../../../utils/objectSelection/select';

const pose = { score: 0, keypoints: [] };

const detection: IDetection = {
    bbox: [0, 0, 0, 0],
    info: pose,
};

const otherDetection: IDetection = {
    bbox: [1, 1, 1, 1],
    info: pose,
};

describe('selectFirstOfType should return', () => {
    const selectFirst = (detections: IDetection[]) => select(detections, first);

    it('undefined when arg:detections is empty', () => {
        expect(selectFirst([])).toBeUndefined();
    });
    it('Bbox of first detection if arg:detections.length > 0', () => {
        expect((selectFirst([detection]) as IDetection).bbox).toBe(
            detection.bbox,
        );
        expect(
            (selectFirst([detection, otherDetection]) as IDetection).bbox,
        ).toBe(detection.bbox);
    });
});
