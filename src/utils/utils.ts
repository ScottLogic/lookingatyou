import { IDetection } from '../models/objectDetection';
import { Bbox, ICoords } from './types';

export function getBbox(detection: IDetection): Bbox | undefined {
    return detection ? detection.bbox : undefined;
}

export function getLargerDistance(old: ICoords, newCoords: ICoords): number {
    return Math.max(
        Math.abs(old.x - newCoords.x),
        Math.abs(old.y - newCoords.y),
    );
}
