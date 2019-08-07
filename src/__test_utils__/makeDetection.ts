import { IDetection } from '../models/objectDetection';

export function makeDetection(x: number, y: number): IDetection {
    return { bbox: [x, y, 0, 0], info: { keypoints: [], score: 0.5 } };
}
