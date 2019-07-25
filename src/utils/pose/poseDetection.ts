import { Keypoint, partIds } from '@tensorflow-models/posenet';
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

    const leftDab = checkLeftDab(keypoints);
    const rightDab = checkRightDab(keypoints);

    return leftDab || rightDab;
}

function checkRightDab(keypoints: Keypoint[]): boolean {
    const eyesBetweenWristAndShoulder =
        keypoints[partIds.rightWrist].position.x <
        keypoints[partIds.leftEye].position.x;

    const armPointingToTheSky =
        keypoints[partIds.rightWrist].position.x <
            keypoints[partIds.rightElbow].position.x &&
        keypoints[partIds.rightElbow].position.x <
            keypoints[partIds.rightShoulder].position.x &&
        armPointingUp(
            keypoints,
            partIds.rightWrist,
            partIds.rightElbow,
            partIds.rightShoulder,
        );

    const bentWristAboveShoulder =
        keypoints[partIds.leftWrist].position.y <
        keypoints[partIds.rightShoulder].position.y;

    return (
        eyesBetweenWristAndShoulder &&
        armPointingToTheSky &&
        bentWristAboveShoulder
    );
}

function checkLeftDab(keypoints: Keypoint[]): boolean {
    const eyesBetweenWristAndShoulder =
        keypoints[partIds.leftWrist].position.x >
        keypoints[partIds.rightEye].position.x;

    const armPointingToTheSky =
        keypoints[partIds.leftWrist].position.x >
            keypoints[partIds.leftElbow].position.x &&
        keypoints[partIds.leftElbow].position.x >
            keypoints[partIds.leftShoulder].position.x &&
        armPointingUp(
            keypoints,
            partIds.leftWrist,
            partIds.leftElbow,
            partIds.leftShoulder,
        );

    const bendWristAboveOppositeShoulder =
        keypoints[partIds.rightWrist].position.y <
        keypoints[partIds.leftShoulder].position.y;

    return (
        eyesBetweenWristAndShoulder &&
        armPointingToTheSky &&
        bendWristAboveOppositeShoulder
    );
}

function armPointingUp(
    keypoints: Keypoint[],
    wrist: number,
    elbow: number,
    shoulder: number,
) {
    return (
        keypoints[wrist].position.y < keypoints[elbow].position.y &&
        keypoints[elbow].position.y < keypoints[shoulder].position.y
    );
}
