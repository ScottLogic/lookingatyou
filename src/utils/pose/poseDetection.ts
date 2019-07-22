import { IDetection } from '../../models/objectDetection';

export function getPose(selection: IDetection) {
    return false;
}

function wave(selection: IDetection) {
    const keypoints = selection.info.keypoints;
}
