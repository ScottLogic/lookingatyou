const getPupilDisplacement = require('../src/static/js/gui').getPupilDisplacement;
test('person at top right', () => {
    var coords = [-1, 1];
    var maxDisplacement = 1000;
    var xFovBound = 1;
    var yFovBound = 1;
    var pupilDisplacement = getPupilDisplacement(coords, maxDisplacement, xFovBound, yFovBound);
    expect(pupilDisplacement[0]).toBeCloseTo(Math.sqrt(1000 * 1000 / 2));
    expect(pupilDisplacement[1]).toBeCloseTo(Math.sqrt(1000 * 1000 / 2));
});

test('person straight ahead of eye', () => {
    var coords = [0, 0];
    var maxDisplacement = 1000;
    var xFovBound = 1;
    var yFovBound = 1;
    var pupilDisplacement = getPupilDisplacement(coords, maxDisplacement, xFovBound, yFovBound);
    expect(pupilDisplacement[0]).toBeCloseTo(0);
    expect(pupilDisplacement[1]).toBeCloseTo(0);
});

test('person right below eye', () => {
    var coords = [0, -0.1];
    var maxDisplacement = 1000;
    var xFovBound = 1;
    var yFovBound = 0.1;
    var pupilDisplacement = getPupilDisplacement(coords, maxDisplacement, xFovBound, yFovBound);
    expect(pupilDisplacement[0]).toBeCloseTo(0);
    expect(pupilDisplacement[1]).toBeCloseTo(-1000);
});

test('small x fov bound', () => {
    var coords = [-0.75, 0.75];
    var maxDisplacement = 1000;
    var xFovBound = 0.1;
    var yFovBound = 1;
    var pupilDisplacement = getPupilDisplacement(coords, maxDisplacement, xFovBound, yFovBound);
    expect(pupilDisplacement[1]).toBeCloseTo(Math.sqrt(1000 * 1000 / 101));
    expect(pupilDisplacement[0]).toBeCloseTo(10 * pupilDisplacement[1]);
});

test('large x fov bound', () => {
    var coords = [-0.75, 0.75];
    var maxDisplacement = 1000;
    var xFovBound = 10;
    var yFovBound = 1;
    var pupilDisplacement = getPupilDisplacement(coords, maxDisplacement, xFovBound, yFovBound);
    expect(pupilDisplacement[0]).toBeCloseTo(0.1 * pupilDisplacement[1]);
});

test('eye looks slightly left', () => {
    var coords = [0.5, 0];
    var maxDisplacement = 10;
    var xFovBound = 1;
    var yFovBound = 1;
    var pupilDisplacement = getPupilDisplacement(coords, maxDisplacement, xFovBound, yFovBound);
    expect(pupilDisplacement[0]).toBeCloseTo(-5);
    expect(pupilDisplacement[1]).toBeCloseTo(0);
})

test('eye looks slightly up and left', () => {
    var coords = [0.5, 0.5];
    var maxDisplacement = 10;
    var xFovBound = 1;
    var yFovBound = 1;
    var pupilDisplacement = getPupilDisplacement(coords, maxDisplacement, xFovBound, yFovBound);
    expect(pupilDisplacement[0]).toBeCloseTo(-5);
    expect(pupilDisplacement[1]).toBeCloseTo(5);
})

test('both fov bounds non-one, coords between 0 and 1, eye displacement not at maximum', () => {
    var coords = [-0.5, 0.6];
    var maxDisplacement = 10;
    var xFovBound = 2;
    var yFovBound = 3.5;
    var pupilDisplacement = getPupilDisplacement(coords, maxDisplacement, xFovBound, yFovBound);
    expect(pupilDisplacement[0]).toBeCloseTo(2.5);
    expect(pupilDisplacement[1]).toBeCloseTo(1.714287);
})


