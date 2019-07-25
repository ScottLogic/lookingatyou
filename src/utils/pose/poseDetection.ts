import { Keypoint, partIds } from '@tensorflow-models/posenet';
import { Pose } from '../../AppConstants';
import { IDetection } from '../../models/objectDetection';

const poseMapping: { [key: string]: (selection: IDetection) => boolean } = {
    [Pose.WAVE]: wave,
    [Pose.HANDS_UP]: handsUp,
    [Pose.ARMS_OUT]: armsOutToSide,
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

function armsOutToSide(selection: IDetection) {
    const keypoints = selection.info.keypoints;

    const leftArmOut =
        keypoints[partIds.leftWrist].position.x >
            keypoints[partIds.leftElbow].position.x &&
        keypoints[partIds.leftElbow].position.x >
            keypoints[partIds.leftShoulder].position.x;
        /*isWristAtShoulderHeight(
            keypoints,
            partIds.leftWrist,
            partIds.leftShoulder,
        );*/

    const rightArmOut =
        keypoints[partIds.rightWrist].position.x <
            keypoints[partIds.rightElbow].position.x &&
        keypoints[partIds.rightElbow].position.x <
            keypoints[partIds.rightShoulder].position.x;
        /*isWristAtShoulderHeight(
            keypoints,
            partIds.rightWrist,
            partIds.rightShoulder,
        );*/

    return leftArmOut && rightArmOut;
}
