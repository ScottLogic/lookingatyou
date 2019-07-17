import { getBoundingBox, Pose } from '@tensorflow-models/posenet';
import { Detection, DetectionModelType } from '../../models/objectDetection';
import Posenet from '../../utils/objectDetection/posenet';

const testPose: Pose = {
    score: 50,
    keypoints: [
        {
            position: {
                y: 70,
                x: 250,
            },
            part: 'nose',
            score: 0.9,
        },
        {
            position: {
                y: 75,
                x: 245,
            },
            part: 'leftEye',
            score: 0.9,
        },
        {
            position: {
                y: 75,
                x: 255,
            },
            part: 'rightEye',
            score: 0.9,
        },
        {
            position: {
                y: 75,
                x: 265,
            },
            part: 'leftEar',
            score: 0.9,
        },
        {
            position: {
                y: 75,
                x: 235,
            },
            part: 'rightEar',
            score: 0.9,
        },
        {
            position: {
                y: 100,
                x: 400,
            },
            part: 'leftShoulder',
            score: 0.9,
        },
        {
            position: {
                y: 100,
                x: 460,
            },
            part: 'rightShoulder',
            score: 0.9,
        },
        {
            position: {
                y: 95,
                x: 160,
            },
            part: 'leftElbow',
            score: 0.9,
        },
        {
            position: {
                y: 150,
                x: 245,
            },
            part: 'rightElbow',
            score: 0.9,
        },
        {
            position: {
                y: 100,
                x: 400,
            },
            part: 'leftWrist',
            score: 0.9,
        },
        {
            position: {
                y: 200,
                x: 250,
            },
            part: 'rightWrist',
            score: 0.9,
        },
        {
            position: {
                y: 200,
                x: 280,
            },
            part: 'leftHip',
            score: 0.9,
        },
        {
            position: {
                y: 200,
                x: 240,
            },
            part: 'rightHip',
            score: 0.9,
        },
        {
            position: {
                y: 280,
                x: 300,
            },
            part: 'leftKnee',
            score: 0.9,
        },
        {
            position: {
                y: 280,
                x: 200,
            },
            part: 'rightKnee',
            score: 0.9,
        },
        {
            position: {
                y: 350,
                x: 290,
            },
            part: 'leftAnkle',
            score: 0.9,
        },
        {
            position: {
                y: 350,
                x: 200,
            },
            part: 'rightAnkle',
            score: 0.9,
        },
    ],
};

const testInput = [testPose];

const testOutput: Detection[] = [
    {
        model: DetectionModelType.Posenet,
        bbox: [245, 75, 10, 0],
        info: testPose,
    },
];

describe('Posenet', () => {
    it('shapeDetect should return object of shape Detection', () => {
        expect(Posenet.reshapeDetections(testInput)).toStrictEqual(testOutput);
    });
});
