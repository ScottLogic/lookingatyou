import { IDetection } from '../../../models/objectDetection';
import {
    calculateColourMatch,
    closerToColour,
    closerToPrediction,
    getAvgColour,
    getPredictedColour,
    getPredictedTarget,
    leftOf,
    rightOf,
} from '../../../utils/objectSelection/select';

export const detection1: IDetection = {
    bbox: [
        135.713721802516,
        245.63915702867212,
        70.9147492402829,
        9.40689987277392,
    ],
    info: {
        score: 0.3542923811439644,
        keypoints: [
            {
                score: 0.982316792011261,
                part: 'nose',
                position: { x: 182.6830268054275, y: 282.5726735369759 },
            },
            {
                score: 0.9830629825592041,
                part: 'leftEye',
                position: {
                    x: 206.6284710427989,
                    y: 255.04605690144604,
                },
            },
            {
                score: 0.9989088773727417,
                part: 'rightEye',
                position: { x: 135.713721802516, y: 245.63915702867212 },
            },
            {
                score: 0.13695715367794037,
                part: 'leftEar',
                position: {
                    x: 215.65198436286877,
                    y: 263.2577817928717,
                },
            },
            {
                score: 0.9664620161056519,
                part: 'rightEar',
                position: {
                    x: 64.62739814142263,
                    y: 255.08318409416245,
                },
            },
            {
                score: 0.6920456290245056,
                part: 'leftShoulder',
                position: {
                    x: 200.14392734314345,
                    y: 318.80535812851804,
                },
            },
            {
                score: 0.2669237554073334,
                part: 'rightShoulder',
                position: {
                    x: 47.418864943225934,
                    y: 332.75880043551047,
                },
            },
            {
                score: 0.30399706959724426,
                part: 'leftElbow',
                position: { x: 277.4323609156638, y: 305.774517177795 },
            },
            {
                score: 0.0013581286184489727,
                part: 'rightElbow',
                position: {
                    x: -25.033817646666343,
                    y: 415.1739928441018,
                },
            },
            {
                score: 0.39481088519096375,
                part: 'leftWrist',
                position: {
                    x: 318.6435927515445,
                    y: 291.30439805688326,
                },
            },
            {
                score: 0.013654034584760666,
                part: 'rightWrist',
                position: {
                    x: -13.917594577955162,
                    y: 338.03822772103064,
                },
            },
            {
                score: 0.008747724816203117,
                part: 'leftHip',
                position: { x: 189.3666034011367, y: 398.6515021472244 },
            },
            {
                score: 0.003800700418651104,
                part: 'rightHip',
                position: { x: 48.74508780722292, y: 438.8686167083172 },
            },
            {
                score: 0.05683870241045952,
                part: 'leftKnee',
                position: { x: 212.1246982361219, y: 333.9713074109569 },
            },
            {
                score: 0.038288090378046036,
                part: 'rightKnee',
                position: {
                    x: 73.27626577815654,
                    y: 328.12482182283577,
                },
            },
            {
                score: 0.1377871036529541,
                part: 'leftAnkle',
                position: {
                    x: 272.50924625752134,
                    y: 296.2857851774796,
                },
            },
            {
                score: 0.037010833621025085,
                part: 'rightAnkle',
                position: { x: 66.38771910104693, y: 333.6637470885093 },
            },
        ],
    },
};

export const detection2: IDetection = {
    bbox: [
        314.26568830975833,
        101.02871154406057,
        4.918859493658431,
        1.97744097028459,
    ],
    info: {
        score: 0.43310422669438753,
        keypoints: [
            {
                score: 0.5949299335479736,
                part: 'nose',
                position: { x: 349.9492574182356, y: 110.9545696151923 },
            },
            {
                score: 0.20000481605529785,
                part: 'leftEye',
                position: {
                    x: 319.18454780341676,
                    y: 101.02871154406057,
                },
            },
            {
                score: 0.2114918977022171,
                part: 'rightEye',
                position: {
                    x: 314.26568830975833,
                    y: 103.00615251434516,
                },
            },
            {
                score: 0.41215062141418457,
                part: 'leftEar',
                position: {
                    x: 335.0867703834676,
                    y: 112.78128736507819,
                },
            },
            {
                score: 0.28096771240234375,
                part: 'rightEar',
                position: { x: 331.98815102903, y: 115.75892146329701 },
            },
            {
                score: 0.9222745299339294,
                part: 'leftShoulder',
                position: {
                    x: 341.68161712077836,
                    y: 167.52048137025062,
                },
            },
            {
                score: 0.9579591751098633,
                part: 'rightShoulder',
                position: { x: 380.0511508254531, y: 178.1491133885354 },
            },
            {
                score: 0.793774425983429,
                part: 'leftElbow',
                position: {
                    x: 322.4428136600471,
                    y: 239.00581365786724,
                },
            },
            {
                score: 0.6985154151916504,
                part: 'rightElbow',
                position: { x: 374.388993067771, y: 238.2633188496465 },
            },
            {
                score: 0.5965401530265808,
                part: 'leftWrist',
                position: {
                    x: 293.9900937287704,
                    y: 243.48244850679953,
                },
            },
            {
                score: 0.5593912601470947,
                part: 'rightWrist',
                position: { x: 402.1948488602727, y: 215.6559952445652 },
            },
            {
                score: 0.49444594979286194,
                part: 'leftHip',
                position: { x: 329.1935597295346, y: 304.3688915086829 },
            },
            {
                score: 0.7087492942810059,
                part: 'rightHip',
                position: {
                    x: 318.12380509346906,
                    y: 305.8358977892384,
                },
            },
            {
                score: 0.28256845474243164,
                part: 'leftKnee',
                position: { x: 330.0353615328392, y: 286.922824456825 },
            },
            {
                score: 0.1455676108598709,
                part: 'rightKnee',
                position: { x: 323.5587770450189, y: 286.7497698860879 },
            },
            {
                score: 0.15022675693035126,
                part: 'leftAnkle',
                position: { x: 316.4634701035778, y: 298.3317603828004 },
            },
            {
                score: 0.09998075664043427,
                part: 'rightAnkle',
                position: {
                    x: 312.93763533882475,
                    y: 297.4615914481027,
                },
            },
        ],
    },
};

export const simulatedDetections = [detection1, detection2];

export const imageData = getImageData();

function getImageData(): ImageData {
    const data = new Uint8ClampedArray(1382400);

    for (let i = 0; i < 1382400; i += 4) {
        data[i + 0] = 190; // R value
        data[i + 1] = 0; // G value
        data[i + 2] = i < 691200 ? 210 : 0; // B value
        data[i + 3] = 255; // A value
    }

    return { data, width: 720, height: 480 };
}

describe('utils', () => {
    describe('calculateColourMatch', () => {
        const result = calculateColourMatch([]);
        it('should return default for undefined imageData', () =>
            expect(result).toStrictEqual({ r: 0, g: 0, b: 0 }));

        it('should return average colour at those points', () => {
            expect(
                calculateColourMatch(detection1.info.keypoints, imageData),
            ).toStrictEqual({ r: 188, g: 0, b: 0 });
        });
    });

    describe('getAvgColour', () => {
        const data = new Uint8ClampedArray(400);

        for (let i = 0; i < 400; i += 4) {
            data[i + 0] = 190; // R value
            data[i + 1] = 0; // G value
            data[i + 2] = 210; // B value
            data[i + 3] = 255; // A value
        }

        const image = { data, width: 10, height: 10 };

        it('should return average value for correct data', () => {
            const result = getAvgColour(0, 0, 10, 10, image);
            expect(result).toStrictEqual({ r: 189, g: 0, b: 208 });
        });
    });

    describe('getPredictedTarget', () => {
        const noHistory = [{ x: 0, y: 0 }];
        it('should return (0,0) for idle target', () => {
            expect(getPredictedTarget(noHistory)).toStrictEqual({ x: 0, y: 0 });
        });

        const oneAhead = [{ x: 0, y: 0 }, { x: 1, y: -1 }, { x: 2, y: -2 }];
        it('should return (3,-3) for increasing sequence', () => {
            expect(getPredictedTarget(oneAhead)).toStrictEqual({ x: 3, y: -3 });
        });
    });

    describe('getPredictedColour', () => {
        const noHistory = [{ r: 0, g: 0, b: 0 }];
        const result = getPredictedColour(noHistory);
        it('should return black on default history', () => {
            expect(result).toStrictEqual({ r: 0, g: 0, b: 0 });
        });

        const history = [{ r: 0, g: 0, b: 0 }, { r: 15, g: 15, b: 15 }];
        const historyResult = getPredictedColour(history);
        it('should return avgerage if there is history', () => {
            expect(historyResult).toStrictEqual({ r: 10, g: 10, b: 10 });
        });
    });

    describe('leftOf/rightOf', () => {
        it('leftOf/rightOf should be true/false', () => {
            expect(leftOf(Number.MAX_SAFE_INTEGER)(detection1)).toBeTruthy();
            expect(rightOf(Number.MAX_SAFE_INTEGER)(detection1)).toBeFalsy();
        });
        it('leftOf/rightOf should be false/true', () => {
            expect(leftOf(Number.MIN_SAFE_INTEGER)(detection1)).toBeFalsy();
            expect(rightOf(Number.MIN_SAFE_INTEGER)(detection1)).toBeTruthy();
        });
    });
});

describe('closerToColour', () => {
    const points1 = detection1.info.keypoints;
    const points2 = detection2.info.keypoints;
    const colour = { r: 190, g: 0, b: 0 };

    it('should return positive for first arg better match', () => {
        expect(
            closerToColour(imageData, colour, points1, points2),
        ).toBeGreaterThan(0);
    });
});

describe('closerToPrediction', () => {
    const origin = { x: 0, y: 0 };
    const colour = { r: 188, g: 0, b: 0 };

    it('should return positive for new better target', () => {
        expect(
            closerToPrediction(origin, imageData, colour)(
                detection1,
                detection2,
            ),
        ).toBeGreaterThan(0);
    });
    it('should return negative for new worse target', () => {
        expect(
            closerToPrediction(origin, imageData, colour)(
                detection2,
                detection1,
            ),
        ).toBeLessThan(0);
    });
});
