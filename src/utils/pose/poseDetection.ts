import { partIds } from '@tensorflow-models/posenet';
import { Pose } from '../../AppConstants';
import { IDetection } from '../../models/objectDetection';

const poseMapping: { [key: string]: (selection: IDetection) => boolean } = {
    [Pose.DAB]: dab,
    [Pose.WAVE]: wave,
    [Pose.HANDS_UP]: handsUp,
};

export function getPose(selection: IDetection): string | undefined {
    return Object.keys(poseMapping).find(element =>
        poseMapping[element](selection),
    );
}

function wave(selection: IDetection) {
    const keypoints = selection.info.keypoints;
    return (
        keypoints[partIds.rightWrist].position.y <
            keypoints[partIds.rightEye].position.y &&
        keypoints[partIds.leftWrist].position.y >
            keypoints[partIds.leftEye].position.y
    );
}

function handsUp(selection: IDetection) {
    const keypoints = selection.info.keypoints;
    return (
        keypoints[partIds.rightWrist].position.y <
            keypoints[partIds.rightEye].position.y &&
        keypoints[partIds.leftWrist].position.y <
            keypoints[partIds.leftEye].position.y
    );
}

function dab(selection: IDetection) {
    const keypoints = selection.info.keypoints;
    const eyesBetweenWristAndShoulder =
        keypoints[partIds.rightWrist].position.x >
        keypoints[partIds.leftEye].position.x;
    const armPointingToTheSky =
        keypoints[partIds.leftWrist].position.x >
            keypoints[partIds.leftElbow].position.x &&
        keypoints[partIds.leftElbow].position.x >
            keypoints[partIds.leftShoulder].position.x &&
        keypoints[partIds.leftWrist].position.y <
            keypoints[partIds.leftElbow].position.y &&
        keypoints[partIds.leftElbow].position.y <
            keypoints[partIds.leftShoulder].position.y;
    const bendWristAboveNose =
        keypoints[partIds.rightWrist].position.y <
        keypoints[partIds.rightElbow].position.y;

    const leftDab =
        eyesBetweenWristAndShoulder &&
        armPointingToTheSky &&
        bendWristAboveNose;

    const rightEyesBetweenWristAndShoulder =
        keypoints[partIds.rightWrist].position.x <
        keypoints[partIds.leftEye].position.x;
    const rightArmPointingToTheSky =
        keypoints[partIds.leftWrist].position.x <
            keypoints[partIds.leftElbow].position.x &&
        keypoints[partIds.leftElbow].position.x <
            keypoints[partIds.leftShoulder].position.x &&
        keypoints[partIds.leftWrist].position.y <
            keypoints[partIds.leftElbow].position.y &&
        keypoints[partIds.leftElbow].position.y <
            keypoints[partIds.leftShoulder].position.y;
    const rightBendWristAboveNose =
        keypoints[partIds.rightWrist].position.y <
        keypoints[partIds.rightElbow].position.y;

    const rightDab =
        rightArmPointingToTheSky &&
        rightBendWristAboveNose &&
        rightEyesBetweenWristAndShoulder;

    return leftDab || rightDab;
}
