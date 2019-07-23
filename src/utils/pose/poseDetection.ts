import { partIds } from '@tensorflow-models/posenet';
import { Pose } from '../../AppConstants';
import { IDetection } from '../../models/objectDetection';

const poseMapping: { [key: string]: (selection: IDetection) => boolean } = {
    [Pose.WAVE]: wave,
};

export function getPose(selection: IDetection): string | null {
    const pose = Object.keys(poseMapping).map((key: string) => {
        return poseMapping[key](selection) ? key : null;
    });
    return pose.length > 0 ? pose[0] : null;
}

function wave(selection: IDetection) {
    const keypoints = selection.info.keypoints;
    return (
        keypoints[partIds.rightWrist].position.y <
        keypoints[partIds.rightEye].position.y
    );
}
