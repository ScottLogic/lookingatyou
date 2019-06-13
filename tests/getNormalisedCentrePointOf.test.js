const getNormalisedCentrePointOf = require('../src/static/js/frame_feed').getNormalisedCentrePointOf;
var video_1920_1080 = {width: 1920, height: 1080};
describe('getNormalisedCentrePointof', () => {
    it('bounding box is point in bottom left corner, so is centre point', () => {
        var coords = [0, 0, 0, 0];
        point = getNormalisedCentrePointOf(coords, video_1920_1080);
        expect(point).toStrictEqual([-1,-1]);
    });
    it('bounding box spans screen, so point is in centre of screen', () => {
        var coords = [0, 0, 1920, 1080];
        point = getNormalisedCentrePointOf(coords, video_1920_1080);
        expect(point).toStrictEqual([0,0]);
    });
    it('bounding box is point in exact middle of screen, so centre point is in centre of screen', () => {
        var coords = [960, 540, 0, 0];
        point = getNormalisedCentrePointOf(coords, video_1920_1080);
        expect(point).toStrictEqual([0,0]);
    });
    it('centre point does not have integer coordinates', () => {
        var coords = [500, 500, 1000, 20];
        point = getNormalisedCentrePointOf(coords, video_1920_1080);
        expect(point[0]).toBeCloseTo(0.04167);
        expect(point[1]).toBeCloseTo(-0.05555555);
    });
});
