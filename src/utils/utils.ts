import { getBoundingBox, partIds, Pose } from '@tensorflow-models/posenet';
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

export function reshapeDetections(detections: Pose[]): IDetection[] {
    return detections.map(detection => {
        const keypoints = detection.keypoints;
        const box = getBoundingBox([
            keypoints[partIds.leftEye],
            keypoints[partIds.rightEye],
        ]);
        return {
            bbox: [
                box.minX,
                box.minY,
                box.maxX - box.minX,
                box.maxY - box.minY,
            ],
            info: detection,
        };
    });
}
