import { Keypoint, partIds } from '@tensorflow-models/posenet';
import { minPoseConfidence, Pose } from '../../AppConstants';
import { IDetection } from '../../models/objectDetection';
import { checkAngle } from '../utils';

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
    [Pose.HANDS_UP]: handsUp,
    [Pose.ARMS_OUT]: armsOutToSide,
    [Pose.LEFT_WAVE]: leftWave,
    [Pose.RIGHT_WAVE]: rightWave,
};

export function getPose(selection: IDetection): string | undefined {
    const poseKeypoints = getPoseKeypoints(selection);
    return Object.keys(poseMapping).find(element => {
        return poseMapping[element](poseKeypoints);
    });
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

function rightWave(pose: IPoseKeypoints) {
    const isArmOutToSide =
        pose.rightElbow.position.x < pose.rightShoulder.position.x;

    const isValidAngle = checkAngle(
        pose.rightShoulder,
        pose.rightElbow,
        pose.rightWrist,
        70,
        95,
    );

    return (
        isArmOutToSide &&
        isValidAngle &&
        wave(pose.rightWrist, pose.rightElbow, pose.leftWrist, pose.leftElbow)
    );
}

function leftWave(pose: IPoseKeypoints) {
    const isArmOutToSide =
        pose.leftElbow.position.x > pose.leftShoulder.position.x;

    const isValidAngle = checkAngle(
        pose.leftShoulder,
        pose.leftElbow,
        pose.leftWrist,
        70,
        95,
    );

    return (
        isArmOutToSide &&
        isValidAngle &&
        wave(pose.leftWrist, pose.leftElbow, pose.rightWrist, pose.rightElbow)
    );
}

function wave(
    wavingWrist: Keypoint,
    wavingElbow: Keypoint,
    stationaryWrist: Keypoint,
    stationaryElbow: Keypoint,
) {
    const areValidWavingPoints = checkKeypoints(wavingWrist, wavingElbow);

    const areValidStationaryPoints = checkKeypoints(
        stationaryWrist,
        stationaryElbow,
    );

    const pointingUpAngle =
        (180 *
            Math.atan2(
                wavingElbow.position.y - wavingWrist.position.y,
                wavingWrist.position.x - wavingElbow.position.x,
            )) /
        Math.PI;

    const isValidAngle = pointingUpAngle > 60 && pointingUpAngle < 120;

    const isWavingWristAboveElbow =
        wavingWrist.position.y < wavingElbow.position.y;

    const isStationaryWristBelowElbow =
        stationaryWrist.position.y > stationaryElbow.position.y;

    return (
        isValidAngle &&
        areValidWavingPoints &&
        isWavingWristAboveElbow &&
        (!areValidStationaryPoints || isStationaryWristBelowElbow)
    );
}

function handsUp(pose: IPoseKeypoints) {
    const areValidPoints = checkKeypoints(
        pose.leftEye,
        pose.leftWrist,
        pose.leftElbow,
        pose.leftShoulder,
        pose.rightEye,
        pose.rightWrist,
        pose.rightElbow,
        pose.rightShoulder,
    );

    const areArmsAboveEyes =
        pose.rightWrist.position.y < pose.rightEye.position.y &&
        pose.leftWrist.position.y < pose.leftEye.position.y;

    const areArmsPointingUp =
        armPointingUp(pose.leftWrist, pose.leftElbow, pose.leftShoulder) &&
        armPointingUp(pose.rightWrist, pose.rightElbow, pose.rightShoulder);

    return areValidPoints && areArmsAboveEyes && areArmsPointingUp;
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

    const isLeftArmOut =
        pose.leftWrist.position.x > pose.leftElbow.position.x &&
        pose.leftElbow.position.x > pose.leftShoulder.position.x;

    const isLeftWristShoulderHeight = isWristAtShoulderHeight(
        pose.leftWrist,
        pose.leftShoulder,
    );

    const isValidLeftArmAngle = checkAngle(
        pose.leftShoulder,
        pose.leftElbow,
        pose.leftWrist,
        150,
        180,
    );

    const isRightArmOut =
        pose.rightWrist.position.x < pose.rightElbow.position.x &&
        pose.rightElbow.position.x < pose.rightShoulder.position.x;

    const isRightWristShoulderHeight = isWristAtShoulderHeight(
        pose.rightWrist,
        pose.rightShoulder,
    );

    const isValidRightArmAngle = checkAngle(
        pose.rightShoulder,
        pose.rightElbow,
        pose.rightWrist,
        150,
        180,
    );

    return (
        isLeftArmOut &&
        isRightArmOut &&
        isLeftWristShoulderHeight &&
        isRightWristShoulderHeight &&
        isValidLeftArmAngle &&
        isValidRightArmAngle
    );
}

function isWristAtShoulderHeight(wrist: Keypoint, shoulder: Keypoint): boolean {
    return (
        wrist.position.y < shoulder.position.y + 25 &&
        wrist.position.y > shoulder.position.y - 25
    );
}

function dab(pose: IPoseKeypoints) {
    const isValidLeftDab = checkLeftDab(pose);
    const isValidRightDab = checkRightDab(pose);

    return isValidLeftDab || isValidRightDab;
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

    const isValidRightArmAngle = checkAngle(
        pose.rightShoulder,
        pose.rightElbow,
        pose.rightWrist,
        150,
        180,
    );

    const isValidLeftArmAngle = checkAngle(
        pose.leftShoulder,
        pose.leftElbow,
        pose.leftWrist,
        30,
        70,
    );

    const isArmPointingToTheSky =
        pose.rightWrist.position.x < pose.rightElbow.position.x &&
        pose.rightElbow.position.x < pose.rightShoulder.position.x &&
        armPointingUp(pose.rightWrist, pose.rightElbow, pose.rightShoulder);

    return isValidRightArmAngle && isValidLeftArmAngle && isArmPointingToTheSky;
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

    const isValidLeftArmAngle = checkAngle(
        pose.leftShoulder,
        pose.leftElbow,
        pose.leftWrist,
        150,
        180,
    );

    const isValidRightArmAngle = checkAngle(
        pose.rightShoulder,
        pose.rightElbow,
        pose.rightWrist,
        30,
        70,
    );

    const isArmPointingToTheSky =
        pose.leftWrist.position.x > pose.leftElbow.position.x &&
        pose.leftElbow.position.x > pose.leftShoulder.position.x &&
        armPointingUp(pose.leftWrist, pose.leftElbow, pose.leftShoulder);

    return isValidLeftArmAngle && isValidRightArmAngle && isArmPointingToTheSky;
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
