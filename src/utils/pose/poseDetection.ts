import { Keypoint, partIds } from '@tensorflow-models/posenet';
import { minPoseConfidence, Pose } from '../../AppConstants';
import { IDetection } from '../../models/objectDetection';

interface IPoseKeypoints {
    leftEye: Keypoint;
    rightEye: Keypoint;
    leftShoulder: Keypoint;
    rightShoulder: Keypoint;
    leftElbow: Keypoint;
    rightElbow: Keypoint;
    leftWrist: Keypoint;
    rightWrist: Keypoint;
}

const poseMapping: { [key: string]: (selection: IPoseKeypoints) => boolean } = {
    [Pose.DAB]: dab,
    [Pose.LEFT_WAVE]: leftWave,
    [Pose.RIGHT_WAVE]: rightWave,
    [Pose.HANDS_UP]: handsUp,
    [Pose.ARMS_OUT]: armsOutToSide,
};

export function getPose(selection: IDetection): string | undefined {
    const poseKeypoints = getPoseKeypoints(selection);
    return Object.keys(poseMapping).find(element =>
        poseMapping[element](poseKeypoints),
    );
}

function getPoseKeypoints(selection: IDetection): IPoseKeypoints {
    const keypoints = selection.info.keypoints;

    return {
        leftEye: keypoints[partIds.leftEye],
        rightEye: keypoints[partIds.rightEye],
        leftShoulder: keypoints[partIds.leftShoulder],
        rightShoulder: keypoints[partIds.rightShoulder],
        leftElbow: keypoints[partIds.leftElbow],
        rightElbow: keypoints[partIds.rightElbow],
        leftWrist: keypoints[partIds.leftWrist],
        rightWrist: keypoints[partIds.rightWrist],
    };
}

function leftWave(pose: IPoseKeypoints) {
    return wave(pose.rightWrist, pose.rightEye, pose.leftWrist, pose.leftEye);
}

function rightWave(pose: IPoseKeypoints) {
    return wave(pose.leftWrist, pose.leftEye, pose.rightWrist, pose.rightEye);
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

function handsUp(pose: IPoseKeypoints) {
    return (
        checkKeypoints(
            pose.leftEye,
            pose.leftWrist,
            pose.rightEye,
            pose.rightWrist,
        ) &&
        pose.rightWrist.position.y < pose.rightEye.position.y &&
        pose.leftWrist.position.y < pose.leftEye.position.y
    );
}

function armsOutToSide(pose: IPoseKeypoints) {
    if (
        !checkKeypoints(
            pose.leftElbow,
            pose.leftShoulder,
            pose.leftWrist,
            pose.rightWrist,
            pose.rightElbow,
            pose.rightShoulder,
        )
    ) {
        return false;
    }

    const leftArmOut =
        pose.leftWrist.position.x > pose.leftElbow.position.x &&
        pose.leftElbow.position.x > pose.leftShoulder.position.x;
    const leftWristShoulderHeight = isWristAtShoulderHeight(
        pose.leftWrist,
        pose.leftShoulder,
    );

    const rightArmOut =
        pose.rightWrist.position.x < pose.rightElbow.position.x &&
        pose.rightElbow.position.x < pose.rightShoulder.position.x;
    const rightWristShoulderHeight = isWristAtShoulderHeight(
        pose.rightWrist,
        pose.rightShoulder,
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

function dab(pose: IPoseKeypoints) {
    const leftDab = checkLeftDab(pose);
    const rightDab = checkRightDab(pose);

    return leftDab || rightDab;
}

function checkRightDab(pose: IPoseKeypoints): boolean {
    if (
        !checkKeypoints(
            pose.leftWrist,
            pose.rightEye,
            pose.rightWrist,
            pose.rightElbow,
            pose.rightShoulder,
        )
    ) {
        return false;
    }

    const eyesBetweenWristAndShoulder =
        pose.leftWrist.position.x < pose.rightEye.position.x;

    const armPointingToTheSky =
        pose.rightWrist.position.x < pose.rightElbow.position.x &&
        pose.rightElbow.position.x < pose.rightShoulder.position.x &&
        armPointingUp(pose.rightWrist, pose.rightElbow, pose.rightShoulder);

    const bentWristAboveShoulder =
        pose.leftWrist.position.y < pose.rightShoulder.position.y;

    return (
        eyesBetweenWristAndShoulder &&
        armPointingToTheSky &&
        bentWristAboveShoulder
    );
}

function checkLeftDab(pose: IPoseKeypoints): boolean {
    if (
        !checkKeypoints(
            pose.leftWrist,
            pose.leftEye,
            pose.rightWrist,
            pose.leftShoulder,
            pose.leftElbow,
        )
    ) {
        return false;
    }

    const eyesBetweenWristAndShoulder =
        pose.rightWrist.position.x > pose.leftEye.position.x;

    const armPointingToTheSky =
        pose.leftWrist.position.x > pose.leftElbow.position.x &&
        pose.leftElbow.position.x > pose.leftShoulder.position.x &&
        armPointingUp(pose.leftWrist, pose.leftElbow, pose.leftShoulder);

    const bendWristAboveOppositeShoulder =
        pose.rightWrist.position.y < pose.leftShoulder.position.y;

    return (
        eyesBetweenWristAndShoulder &&
        armPointingToTheSky &&
        bendWristAboveOppositeShoulder
    );
}

export function armPointingUp(
    wrist: Keypoint,
    elbow: Keypoint,
    shoulder: Keypoint,
) {
    return (
        wrist.position.y < elbow.position.y &&
        elbow.position.y < shoulder.position.y
    );
}

function checkKeypoints(...points: Keypoint[]): boolean {
    return !points.some(point => point.score < minPoseConfidence);
}
