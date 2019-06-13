const getPupilDisplacement = require('../static/js/gui').getPupilDisplacement;
test('basic', () => {
    var coords = [-1, 1];
    var max_displacement = 1000;
    var x_fov_bound = 1;
    var y_fov_bound = 1;
    var pupilDisplacement = getPupilDisplacement(coords, max_displacement, x_fov_bound, y_fov_bound);
    expect(pupilDisplacement[0]).toBeCloseTo(Math.sqrt(1000 * 1000 / 2));
    expect(pupilDisplacement[1]).toBeCloseTo(Math.sqrt(1000 * 1000 / 2));
});

