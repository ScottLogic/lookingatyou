import { Keypoint } from '@tensorflow-models/posenet';
import { Pose } from '../../AppConstants';
import { getPose } from '../../utils/pose/poseDetection';
import { Bbox, ICoords } from '../../utils/types';
import { checkAngle } from '../../utils/utils';

const genericBbox: Bbox = [0, 1, 2, 3];
const origin = { x: 0, y: 0 };

function getLowScorePart(part: string): Keypoint {
    return getPart(0, origin, part);
}

function getPart(score: number, position: ICoords, part: string) {
    return {
        score,
        position,
        part,
    };
}

const nose = getPart(1, origin, 'nose');
const leftEar = getPart(1, origin, 'leftEar');
const rightEar = getPart(1, origin, 'rightEar');
const leftHip = getPart(1, origin, 'leftHip');
const rightHip = getPart(1, origin, 'rightHip');
const leftKnee = getPart(1, origin, 'leftKnee');
const rightKnee = getPart(1, origin, 'rightKnee');
const leftAnkle = getPart(1, origin, 'leftAnkle');
const rightAnkle = getPart(1, origin, 'rightAnkle');

describe('getPose', () => {
    const rightWrist = getLowScorePart('rightWrist');
    const leftWrist = getLowScorePart('leftWrist');
    const rightElbow = getLowScorePart('rightElbow');
    const leftElbow = getLowScorePart('leftElbow');
    const rightShoulder = getLowScorePart('rightShoulder');
    const leftShoulder = getLowScorePart('leftShoulder');
    const rightEye = getLowScorePart('rightEye');
    const leftEye = getLowScorePart('leftEye');

    const keypoints: Keypoint[] = [
        nose,
        leftEye,
        rightEye,
        leftEar,
        rightEar,
        leftShoulder,
        rightShoulder,
        leftElbow,
        rightElbow,
        leftWrist,
        rightWrist,
        leftHip,
        rightHip,
        leftKnee,
        rightKnee,
        leftAnkle,
        rightAnkle,
    ];

    const lowCofidenceDetection = {
        bbox: genericBbox,
        info: {
            score: 0,
            keypoints,
        },
    };

    const waveRightWrist = getPart(1, { x: 0, y: 10 }, 'rightWrist');
    const waveLeftWrist = getPart(1, { x: 10, y: 0 }, 'leftWrist');
    const waveRightElbow = getPart(1, { x: 0, y: 0 }, 'rightElbow');
    const waveLeftElbow = getPart(1, { x: 10, y: 20 }, 'leftElbow');
    const waveRightShoulder = getPart(1, { x: 0, y: 0 }, 'rightShoulder');
    const waveLeftShoulder = getPart(1, { x: 0, y: 20 }, 'leftShoulder');
    const waveRightEye = getPart(1, { x: 0, y: -10 }, 'rightEye');
    const waveLeftEye = getPart(1, { x: 0, y: 10 }, 'leftEye');

    const waveKeypoints: Keypoint[] = [
        nose,
        waveLeftEye,
        waveRightEye,
        leftEar,
        rightEar,
        waveLeftShoulder,
        waveRightShoulder,
        waveLeftElbow,
        waveRightElbow,
        waveLeftWrist,
        waveRightWrist,
        leftHip,
        rightHip,
        leftKnee,
        rightKnee,
        leftAnkle,
        rightAnkle,
    ];

    const wave = {
        bbox: genericBbox,
        info: {
            score: 1,
            keypoints: waveKeypoints,
        },
    };

    const armsRightWrist = getPart(1, { x: -10, y: 0 }, 'rightWrist');
    const armsLeftWrist = getPart(1, { x: 10, y: 0 }, 'leftWrist');
    const armsRightElbow = getPart(1, { x: 0, y: 0 }, 'rightElbow');
    const armsLeftElbow = getPart(1, { x: 0, y: 0 }, 'leftElbow');
    const armsRightShoulder = getPart(1, { x: 10, y: 0 }, 'rightShoulder');
    const armsLeftShoulder = getPart(1, { x: -10, y: 0 }, 'leftShoulder');
    const armsRightEye = getPart(1, { x: 0, y: 0 }, 'rightEye');
    const armsLeftEye = getPart(1, { x: 0, y: 0 }, 'leftEye');

    const armKeypoints: Keypoint[] = [
        nose,
        armsLeftEye,
        armsRightEye,
        leftEar,
        rightEar,
        armsLeftShoulder,
        armsRightShoulder,
        armsLeftElbow,
        armsRightElbow,
        armsLeftWrist,
        armsRightWrist,
        leftHip,
        rightHip,
        leftKnee,
        rightKnee,
        leftAnkle,
        rightAnkle,
    ];

    const arms = {
        bbox: genericBbox,
        info: {
            score: 1,
            keypoints: armKeypoints,
        },
    };

    const hipsLeftWrist = getPart(1, { x: -1, y: 1 }, 'leftWrist');
    const hipsLeftElbow = getPart(1, { x: -2, y: 0 }, 'leftElbow');
    const hipsLeftShoulder = getPart(1, { x: -1, y: -1 }, 'leftShoulder');
    const hipsLeftHip = getPart(1, { x: -1, y: 1 }, 'leftHip');
    const hipsRightWrist = getPart(1, { x: 1, y: 1 }, 'rightWrist');
    const hipsRightElbow = getPart(1, { x: 2, y: 0 }, 'rightElbow');
    const hipsRightShoulder = getPart(1, { x: 1, y: -1 }, 'rightShoulder');
    const hipsRightHip = getPart(1, { x: 1, y: 1 }, 'rightHip');
    const hipsKeypoints: Keypoint[] = [
        nose,
        leftEye,
        rightEye,
        leftEar,
        rightEar,
        hipsLeftShoulder,
        hipsRightShoulder,
        hipsLeftElbow,
        hipsRightElbow,
        hipsLeftWrist,
        hipsRightWrist,
        hipsLeftHip,
        hipsRightHip,
        leftKnee,
        rightKnee,
        leftAnkle,
        rightAnkle,
    ];
    const hips = {
        bbox: genericBbox,
        info: {
            score: 1,
            keypoints: hipsKeypoints,
        },
    };

    it('should be undefined for low confidence', () => {
        expect(getPose(lowCofidenceDetection)).toBe(undefined);
    });

    it(`should return ${Pose.LEFT_WAVE}`, () => {
        expect(getPose(wave)).toStrictEqual('LEFT_WAVE');
    });

    it(`should return ${Pose.ARMS_OUT}`, () => {
        expect(getPose(arms)).toStrictEqual('ARMS_OUT');
    });

    it(`should return ${Pose.HANDS_HIPS}`, () => {
        expect(getPose(hips)).toStrictEqual('HANDS_HIPS');
    });
});
