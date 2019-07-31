import { getBoundingBox, partIds, Pose } from '@tensorflow-models/posenet';
import { IDetection } from '../models/objectDetection';
import { Bbox, ICoords } from './types';

export function getBbox(detection: IDetection | undefined): Bbox | undefined {
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

export function getImageDataFromVideo(
    video: HTMLVideoElement | undefined,
    document: Document,
): ImageData | null {
    const image = getImageData(video, document);
    if (image) {
        return image;
    }
    return null;
}

function getImageData(
    video: HTMLVideoElement | undefined,
    document: Document,
): ImageData | null {
    if (video) {
        const canvas = document.createElement('canvas');
        canvas.height = video.height;
        canvas.width = video.width;
        const canvasCtx = canvas.getContext('2d');
        if (canvasCtx) {
            canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
            return canvasCtx.getImageData(0, 0, canvas.width, canvas.height);
        }
    }
    return null;
}
