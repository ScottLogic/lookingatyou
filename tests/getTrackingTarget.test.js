const getTrackingTarget = require('../src/static/js/frame_feed')
    .getTrackingTarget;
describe('getTrackingTarget', () => {
    it('no detections, so null returned', () => {
        var detections = [];
        boundingBox = getTrackingTarget(detections);
        expect(boundingBox).toBe(null);
    });
    it('one detection but no person, so null returned', () => {
        var detections = [
            { bbox: [0, 1, 2, 4], class: 'not-person' },
            { bbox: [4, 4, 4, 4], class: 'chair' },
        ];
        boundingBox = getTrackingTarget(detections);
        expect(boundingBox).toBe(null);
    });
    it('one detection that is a person, so its bounding box returned', () => {
        var detections = [{ bbox: [4, 4, 4, 4], class: 'person' }];
        boundingBox = getTrackingTarget(detections);
        expect(boundingBox).toStrictEqual([4, 4, 4, 4]);
    });
    it('two detections and one is a person, so corresponding bounding box returned', () => {
        var detections = [
            { bbox: [0, 1, 2, 4], class: 'not-person' },
            { bbox: [8, 8, 8, 8], class: 'person' },
        ];
        boundingBox = getTrackingTarget(detections);
        expect(boundingBox).toStrictEqual([8, 8, 8, 8]);
    });
    it('many detections, two of which are persons, so bounding box of first person in detections list is returned', () => {
        var detections = [
            { bbox: [0, 0, 0], class: 'not-person' },
            { bbox: [0, 1, 2, 4], class: 'person' },
            { bbox: [8, 8, 8, 8], class: 'person' },
        ];
        boundingBox = getTrackingTarget(detections);
        expect(boundingBox).toStrictEqual([0, 1, 2, 4]);
    });
});
