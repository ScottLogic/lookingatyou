const getTrackingTarget = require('../static/js/frame_feed').getTrackingTarget;
test('no detections', () => {
    var detections = [];
    boundingBox = getTrackingTarget(detections);
    expect(boundingBox).toBe(null);
});
test('no person', () => {
    var detections = [{ bbox: [0, 1, 2, 4], class: "not-person" },
    { bbox: [4, 4, 4, 4], class: "chair" }];
    boundingBox = getTrackingTarget(detections);
    expect(boundingBox).toBe(null);
});
test('one detection, one person', () => {
    var detections = [{ bbox: [4, 4, 4, 4], class: "person" }];
    boundingBox = getTrackingTarget(detections);
    expect(boundingBox).toStrictEqual([4, 4, 4, 4]);
});
test('two detections, one person', () => {
    var detections = [{ bbox: [0, 1, 2, 4], class: "not-person" },
    { bbox: [8, 8, 8, 8], class: "person" }];
    boundingBox = getTrackingTarget(detections);
    expect(boundingBox).toStrictEqual([8, 8, 8, 8]);
});
test('many detections, two persons', () => {
    var detections = [{bbox : [0,0,0,], class : "not-person"},
        { bbox: [0, 1, 2, 4], class: "person" },
    { bbox: [8, 8, 8, 8], class: "person" }];
    boundingBox = getTrackingTarget(detections);
    expect(boundingBox).toStrictEqual([0,1,2,4]);
});

