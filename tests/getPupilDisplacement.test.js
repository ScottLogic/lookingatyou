const getPupilDisplacement = require(`../src/static/js/gui`)
  .getPupilDisplacement;
describe(`getPupilDisplacement`, () => {
  it(`person at top left of camera feed,
    so eyes look to top right`, () => {
    var coords = [-1, 1];
    var maxDisplacement = 1000;
    var xSensitivity = 1;
    var ySensitivity = 1;
    var pupilDisplacement = getPupilDisplacement(
      coords,
      maxDisplacement,
      xSensitivity,
      ySensitivity,
    );
    expect(pupilDisplacement[0]).toBeCloseTo(Math.sqrt((1000 * 1000) / 2));
    expect(pupilDisplacement[1]).toBeCloseTo(Math.sqrt((1000 * 1000) / 2));
  });

  it(`person in centre of camera feed,
    so eye looks straight ahead`, () => {
    var coords = [0, 0];
    var maxDisplacement = 1000;
    var xSensitivity = 1;
    var ySensitivity = 1;
    var pupilDisplacement = getPupilDisplacement(
      coords,
      maxDisplacement,
      xSensitivity,
      ySensitivity,
    );
    expect(pupilDisplacement[0]).toBeCloseTo(0);
    expect(pupilDisplacement[1]).toBeCloseTo(0);
  });

  it(`person at bottom centre of camera feed,
    so eye looks straight down`, () => {
    var coords = [0, -0.1];
    var maxDisplacement = 1000;
    var xSensitivity = 1;
    var ySensitivity = 10;
    var pupilDisplacement = getPupilDisplacement(
      coords,
      maxDisplacement,
      xSensitivity,
      ySensitivity,
    );
    expect(pupilDisplacement[0]).toBeCloseTo(0);
    expect(pupilDisplacement[1]).toBeCloseTo(-1000);
  });

  it(`large x sensitivity,
    so eye looks far mostly to the side and slightly upwards`, () => {
    var coords = [-0.75, 0.75];
    var maxDisplacement = 1000;
    var xSensitivity = 10;
    var ySensitivity = 1;
    var pupilDisplacement = getPupilDisplacement(
      coords,
      maxDisplacement,
      xSensitivity,
      ySensitivity,
    );
    expect(pupilDisplacement[1]).toBeCloseTo(Math.sqrt((1000 * 1000) / 101));
    expect(pupilDisplacement[0]).toBeCloseTo(10 * pupilDisplacement[1]);
  });

  it(`small x sensitivity,
    so eye looks mostly vertically and slightly to the side`, () => {
    var coords = [-0.75, 0.75];
    var maxDisplacement = 1000;
    var xSensitivity = 0.1;
    var ySensitivity = 1;
    var pupilDisplacement = getPupilDisplacement(
      coords,
      maxDisplacement,
      xSensitivity,
      ySensitivity,
    );
    expect(pupilDisplacement[0]).toBeCloseTo(0.1 * pupilDisplacement[1]);
  });

  it(`both sensitivities 1 and person between centre of camera feed and right side of camera feed,
    so eye looks slightly to the left`, () => {
    var coords = [0.5, 0];
    var maxDisplacement = 10;
    var xSensitivity = 1;
    var ySensitivity = 1;
    var pupilDisplacement = getPupilDisplacement(
      coords,
      maxDisplacement,
      xSensitivity,
      ySensitivity,
    );
    expect(pupilDisplacement[0]).toBeCloseTo(-5);
    expect(pupilDisplacement[1]).toBeCloseTo(0);
  });

  it(`both sensitivities 1 and person between centre of camera feed and top right of camera feed,
    so eye looks slightly left and slightly up`, () => {
    var coords = [0.5, 0.5];
    var maxDisplacement = 10;
    var xSensitivity = 1;
    var ySensitivity = 1;
    var pupilDisplacement = getPupilDisplacement(
      coords,
      maxDisplacement,
      xSensitivity,
      ySensitivity,
    );
    expect(pupilDisplacement[0]).toBeCloseTo(-5);
    expect(pupilDisplacement[1]).toBeCloseTo(5);
  });

  it(`neither sensitivity is 1, coords between 0 and 1, and eye displacement not at maximum, 
    so eye looks somewhere between straight ahead and at the edge, at an angle determined by coordinates and sensitivities`, () => {
    var coords = [-0.5, 0.6];
    var maxDisplacement = 10;
    var xSensitivity = 0.5;
    var ySensitivity = 2 / 7;
    var pupilDisplacement = getPupilDisplacement(
      coords,
      maxDisplacement,
      xSensitivity,
      ySensitivity,
    );
    expect(pupilDisplacement[0]).toBeCloseTo(2.5);
    expect(pupilDisplacement[1]).toBeCloseTo(1.714287);
  });
});
