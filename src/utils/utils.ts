import { IDetection } from '../models/objectDetection';
import { Bbox } from './types';

export function getBbox(detection: IDetection | undefined): Bbox | undefined {
    return detection ? detection.bbox : undefined;
}
