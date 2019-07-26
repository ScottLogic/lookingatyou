import { partIds } from '@tensorflow-models/posenet';
import { Pose } from '../../AppConstants';
import { IDetection } from '../../models/objectDetection';

const poseMapping: { [key: string]: (selection: IDetection) => boolean } = {
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
