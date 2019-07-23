import { partIds } from '@tensorflow-models/posenet';
import { IDetection } from '../../models/objectDetection';

export const WAVE = 'WAVE';

const poseMapping = {
    [WAVE]: wave,
};

export function getPose(selection: IDetection) {
    return wave(selection);
}

function wave(selection: IDetection) {
    const keypoints = selection.info.keypoints;
    if (
        keypoints[partIds.rightWrist].position.y <
        keypoints[partIds.rightShoulder].position.y
    ) {
        console.log('waving');
        return WAVE;
    } else {
        console.log('not waving :(');
    }
    return null;
}
