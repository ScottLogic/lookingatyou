import { Keypoint, partIds } from '@tensorflow-models/posenet';
import { minPoseConfidence, Pose } from '../../AppConstants';
import { IDetection } from '../../models/objectDetection';

const poseMapping: { [key: string]: (selection: IDetection) => boolean } = {
    [Pose.DAB]: dab,
    [Pose.LEFT_WAVE]: leftWave,
    [Pose.RIGHT_WAVE]: rightWave,
    [Pose.HANDS_UP]: handsUp,
    [Pose.ARMS_OUT]: armsOutToSide,
};

export function getPose(selection: IDetection): string | undefined {
    return Object.keys(poseMapping).find(element =>
        poseMapping[element](selection),
    );
}

function leftWave(selection: IDetection) {
    const keypoints = selection.info.keypoints;

    const rightWrist = keypoints[partIds.rightWrist];
    const rightEye = keypoints[partIds.rightEye];
    const leftWrist = keypoints[partIds.leftWrist];
    const leftEye = keypoints[partIds.leftEye];

    return wave(rightWrist, rightEye, leftWrist, leftEye);
}

function rightWave(selection: IDetection) {
    const keypoints = selection.info.keypoints;

    const rightWrist = keypoints[partIds.rightWrist];
    const rightEye = keypoints[partIds.rightEye];
    const leftWrist = keypoints[partIds.leftWrist];
    const leftEye = keypoints[partIds.leftEye];

    return wave(leftWrist, leftEye, rightWrist, rightEye);
}

function wave(
    waveWrist: Keypoint,
    waveEye: Keypoint,
    stationaryWrist: Keypoint,
    stationaryEye: Keypoint,
) {
    return (
        checkKeypoints(waveWrist, waveEye, stationaryEye, stationaryWrist) &&
        (waveWrist.position.y > waveEye.position.y &&
            stationaryWrist.position.y < stationaryEye.position.y)
    );
}

function handsUp(selection: IDetection) {
    const keypoints = selection.info.keypoints;

    const rightWrist = keypoints[partIds.rightWrist];
    const rightEye = keypoints[partIds.rightEye];
    const leftWrist = keypoints[partIds.leftWrist];
    const leftEye = keypoints[partIds.leftEye];

    return (
        checkKeypoints(leftEye, leftWrist, rightEye, rightWrist) &&
        rightWrist.position.y < rightEye.position.y &&
        leftWrist.position.y < leftEye.position.y
    );
}

function armsOutToSide(selection: IDetection) {
    const keypoints = selection.info.keypoints;

    const rightWrist = keypoints[partIds.rightWrist];
    const rightElbow = keypoints[partIds.rightElbow];
    const rightShoulder = keypoints[partIds.rightShoulder];
    const leftWrist = keypoints[partIds.leftWrist];
    const leftElbow = keypoints[partIds.leftElbow];
    const leftShoulder = keypoints[partIds.leftShoulder];

    if (
        !checkKeypoints(
            leftElbow,
            leftShoulder,
            leftWrist,
            rightWrist,
            rightElbow,
            rightShoulder,
        )
    ) {
        return false;
    }

    const leftArmOut =
        leftWrist.position.x > leftElbow.position.x &&
        leftElbow.position.x > leftShoulder.position.x;
    const leftWristShoulderHeight = isWristAtShoulderHeight(
        leftWrist,
        leftShoulder,
    );

    const rightArmOut =
        rightWrist.position.x < rightElbow.position.x &&
        rightElbow.position.x < rightShoulder.position.x;
    const rightWristShoulderHeight = isWristAtShoulderHeight(
        rightWrist,
        rightShoulder,
    );

    return (
        leftArmOut &&
        rightArmOut &&
        leftWristShoulderHeight &&
        rightWristShoulderHeight
    );
}

function isWristAtShoulderHeight(wrist: Keypoint, shoulder: Keypoint): boolean {
    return (
        wrist.position.y < shoulder.position.y + 25 &&
        wrist.position.y > shoulder.position.y - 25
    );
}

function dab(selection: IDetection) {
    const keypoints = selection.info.keypoints;

    const leftDab = checkLeftDab(keypoints);
    const rightDab = checkRightDab(keypoints);

    return leftDab || rightDab;
}

function checkRightDab(keypoints: Keypoint[]): boolean {
    const leftWrist = keypoints[partIds.leftWrist];
    const rightEye = keypoints[partIds.rightEye];
    const rightWrist = keypoints[partIds.rightWrist];
    const rightElbow = keypoints[partIds.rightElbow];
    const rightShoulder = keypoints[partIds.rightShoulder];

    if (
        !checkKeypoints(
            leftWrist,
            rightEye,
            rightWrist,
            rightElbow,
            rightShoulder,
        )
    ) {
        return false;
    }

    const eyesBetweenWristAndShoulder =
        leftWrist.position.x < rightEye.position.x;

    const armPointingToTheSky =
        rightWrist.position.x < rightElbow.position.x &&
        rightElbow.position.x < rightShoulder.position.x &&
        armPointingUp(rightWrist, rightElbow, rightShoulder);

    const bentWristAboveShoulder =
        leftWrist.position.y < rightShoulder.position.y;

    return (
        eyesBetweenWristAndShoulder &&
        armPointingToTheSky &&
        bentWristAboveShoulder
    );
}

function checkLeftDab(keypoints: Keypoint[]): boolean {
    const rightWrist = keypoints[partIds.rightWrist];
    const leftEye = keypoints[partIds.leftEye];
    const leftWrist = keypoints[partIds.leftWrist];
    const leftElbow = keypoints[partIds.leftElbow];
    const leftShoulder = keypoints[partIds.leftShoulder];

    if (
        !checkKeypoints(leftWrist, leftEye, rightWrist, leftShoulder, leftElbow)
    ) {
        return false;
    }

    const eyesBetweenWristAndShoulder =
        rightWrist.position.x > leftEye.position.x;

    const armPointingToTheSky =
        leftWrist.position.x > leftElbow.position.x &&
        leftElbow.position.x > leftShoulder.position.x &&
        armPointingUp(leftWrist, leftElbow, leftShoulder);

    const bendWristAboveOppositeShoulder =
        rightWrist.position.y < leftShoulder.position.y;

    return (
        eyesBetweenWristAndShoulder &&
        armPointingToTheSky &&
        bendWristAboveOppositeShoulder
    );
}

function armPointingUp(wrist: Keypoint, elbow: Keypoint, shoulder: Keypoint) {
    return (
        wrist.position.y < elbow.position.y &&
        elbow.position.y < shoulder.position.y
    );
}

function checkKeypoints(...points: Keypoint[]): boolean {
    return !points.some(point => point.score < minPoseConfidence);
}
