import { Keypoint, partIds } from '@tensorflow-models/posenet';
import { Pose } from '../../AppConstants';
import { IDetection } from '../../models/objectDetection';

const poseMapping: { [key: string]: (selection: IDetection) => boolean } = {
    [Pose.LEFT_WAVE]: leftWave,
    [Pose.RIGHT_WAVE]: rightWave,
    [Pose.HANDS_UP]: handsUp,
};

export function getPose(selection: IDetection): string | undefined {
    return Object.keys(poseMapping).find(element =>
        poseMapping[element](selection),
    );
}

function leftWave(selection: IDetection) {
    const keypoints = selection.info.keypoints;
    return wave(
        keypoints,
        partIds.rightWrist,
        partIds.rightEye,
        partIds.leftWrist,
        partIds.leftEye,
    );
}

function rightWave(selection: IDetection) {
    const keypoints = selection.info.keypoints;
    return wave(
        keypoints,
        partIds.leftWrist,
        partIds.leftEye,
        partIds.rightWrist,
        partIds.rightEye,
    );
}

function wave(
    keypoints: Keypoint[],
    waveWrist: number,
    waveEye: number,
    stationaryWrist: number,
    stationaryEye: number,
) {
    return (
        keypoints[waveWrist].position.y > keypoints[waveEye].position.y &&
        keypoints[stationaryWrist].position.y <
            keypoints[stationaryEye].position.y
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
