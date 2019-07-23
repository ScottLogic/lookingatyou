import { partIds } from '@tensorflow-models/posenet';
import { IDetection } from '../../models/objectDetection';

export const WAVE = 'WAVE';

const poseMapping: { [key: string]: (selection: IDetection) => boolean } = {
    [WAVE]: wave,
};

export function getPose(selection: IDetection): string | null {
    const pose = Object.keys(poseMapping).map((key: string) => {
        return poseMapping[key](selection) ? key : null;
    });
    return pose.length > 0 ? pose[0] : null;
}

function wave(selection: IDetection) {
    const keypoints = selection.info.keypoints;
    if (
        keypoints[partIds.rightWrist].position.y <
        keypoints[partIds.rightShoulder].position.y
    ) {
        console.log('waving');
        return true;
    } else {
        console.log('not waving :(');
    }
    return false;
}
