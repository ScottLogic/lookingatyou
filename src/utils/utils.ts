import { Detection } from '../models/objectDetection';
import { Bbox } from './types';

export function getBbox(detection: Detection): Bbox | undefined {
    return detection ? detection.bbox : undefined;
}
