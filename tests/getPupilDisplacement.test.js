const getPupilDisplacement = require('../src/static/js/gui').getPupilDisplacement;
test('eye looks to top right', () => {
    var coords = [-1, 1];
    var maxDisplacement = 1000;
    var xFovBound = 1;
    var yFovBound = 1;
    var pupilDisplacement = getPupilDisplacement(coords, maxDisplacement, xFovBound, yFovBound);
    expect(pupilDisplacement[0]).toBeCloseTo(Math.sqrt(1000 * 1000 / 2));
    expect(pupilDisplacement[1]).toBeCloseTo(Math.sqrt(1000 * 1000 / 2));
});

test('eye looks straight ahead', () => {
    var coords = [0,0];
    var maxDisplacement = 1000;
    var xFovBound = 1;
    var yFovBound = 1;
    var pupilDisplacement = getPupilDisplacement(coords, maxDisplacement, xFovBound, yFovBound);
    expect(pupilDisplacement[0]).toBeCloseTo(0);
    expect(pupilDisplacement[1]).toBeCloseTo(0);
});

test('small x fov bound', () => {
    var coords = [0,0];
    var maxDisplacement = 1000;
    var xFovBound = 1;
    var yFovBound = 1;
    var pupilDisplacement = getPupilDisplacement(coords, maxDisplacement, xFovBound, yFovBound);
    expect(pupilDisplacement[0]).toBeCloseTo(0);
    expect(pupilDisplacement[1]).toBeCloseTo(0);
});


