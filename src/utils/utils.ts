import { IDetection } from '../models/objectDetection';
import { Bbox } from './types';

export function getBbox(detection: IDetection): Bbox | undefined {
    return detection ? detection.bbox : undefined;
}
