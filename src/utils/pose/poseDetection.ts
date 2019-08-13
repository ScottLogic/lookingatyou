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
    const armOutToSide =
        pose.rightElbow.position.x < pose.rightShoulder.position.x;
   
    const pointingUpAngle = Math.atan2(rightWrist.position.y - rightElbow.position.y, 
                   pose.rightWrist.pose.x - pose.rightElbow.position.x);
    const validAngle = pointingUpAngle > 60 && pointingUpAngle < 120;
    
    const angle = checkAngle(
        pose.rightShoulder,
        pose.rightElbow,
        pose.rightWrist,
        70,
        95,
    );

    return (
        validAngle &&
        armOutToSide &&
        angle &&
        wave(pose.rightWrist, pose.rightElbow, pose.leftWrist, pose.leftElbow)
    );
}

function leftWave(pose: IPoseKeypoints) {
    const armOutToSide =
        pose.leftElbow.position.x > pose.leftShoulder.position.x;

    const pointingUpAngle = Math.atan2(leftWrist.position.y - leftElbow.position.y, 
                   pose.leftWrist.pose.x - pose.leftElbow.position.x);
    const validAngle = pointingUpAngle > 60 && pointingUpAngle < 120;
   
    const angle = checkAngle(
        pose.leftShoulder,
        pose.leftElbow,
        pose.leftWrist,
        70,
        95,
    );

    return (
        validAngle &&
        armOutToSide &&
        angle &&
        wave(pose.leftWrist, pose.leftElbow, pose.rightWrist, pose.rightElbow)
    );
}

function wave(
    wavingWrist: Keypoint,
    wavingElbow: Keypoint,
    stationaryWrist: Keypoint,
    stationaryElbow: Keypoint,
) {
    const validWavingPoints = checkKeypoints(wavingWrist, wavingElbow);

    const validStationaryPoints = checkKeypoints(
        stationaryWrist,
        stationaryElbow,
    );

    const wavingWristAboveElbow =
        wavingWrist.position.y < wavingElbow.position.y;

    const stationaryWristBelowElbow =
        stationaryWrist.position.y > stationaryElbow.position.y;

    return (
        validWavingPoints &&
        wavingWristAboveElbow &&
        (!validStationaryPoints || stationaryWristBelowElbow)
    );
}

function handsUp(pose: IPoseKeypoints) {
    const validPoints = checkKeypoints(
        pose.leftEye,
        pose.leftWrist,
        pose.leftElbow,
        pose.leftShoulder,
        pose.rightEye,
        pose.rightWrist,
        pose.rightElbow,
        pose.rightShoulder,
    );

    const armsAboveEyes =
        pose.rightWrist.position.y < pose.rightEye.position.y &&
        pose.leftWrist.position.y < pose.leftEye.position.y;

    const armsPointingUp =
        armPointingUp(pose.leftWrist, pose.leftElbow, pose.leftShoulder) &&
        armPointingUp(pose.rightWrist, pose.rightElbow, pose.rightShoulder);

    return validPoints && armsAboveEyes && armsPointingUp;
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
    const leftArmAngle = checkAngle(
        pose.leftShoulder,
        pose.leftElbow,
        pose.leftWrist,
        150,
        180,
    );

    const rightArmOut =
        pose.rightWrist.position.x < pose.rightElbow.position.x &&
        pose.rightElbow.position.x < pose.rightShoulder.position.x;
    const rightWristShoulderHeight = isWristAtShoulderHeight(
        pose.rightWrist,
        pose.rightShoulder,
    );
    const rightArmAngle = checkAngle(
        pose.rightShoulder,
        pose.rightElbow,
        pose.rightWrist,
        150,
        180,
    );

    return (
        leftArmOut &&
        rightArmOut &&
        leftWristShoulderHeight &&
        rightWristShoulderHeight &&
        leftArmAngle &&
        rightArmAngle
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

    const rightArmAngle = checkAngle(
        pose.rightShoulder,
        pose.rightElbow,
        pose.rightWrist,
        150,
        180,
    );

    const leftArmAngle = checkAngle(
        pose.leftShoulder,
        pose.leftElbow,
        pose.leftWrist,
        30,
        70,
    );

    const armPointingToTheSky =
        pose.rightWrist.position.x < pose.rightElbow.position.x &&
        pose.rightElbow.position.x < pose.rightShoulder.position.x &&
        armPointingUp(pose.rightWrist, pose.rightElbow, pose.rightShoulder);

    return rightArmAngle && leftArmAngle && armPointingToTheSky;
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

    const leftArmAngle = checkAngle(
        pose.leftShoulder,
        pose.leftElbow,
        pose.leftWrist,
        150,
        180,
    );

    const rightArmAngle = checkAngle(
        pose.rightShoulder,
        pose.rightElbow,
        pose.rightWrist,
        30,
        70,
    );

    const armPointingToTheSky =
        pose.leftWrist.position.x > pose.leftElbow.position.x &&
        pose.leftElbow.position.x > pose.leftShoulder.position.x &&
        armPointingUp(pose.leftWrist, pose.leftElbow, pose.leftShoulder);

    return leftArmAngle && rightArmAngle && armPointingToTheSky;
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
