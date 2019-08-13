import {
    getBoundingBox,
    Keypoint,
    partIds,
    Pose,
} from '@tensorflow-models/posenet';
import { IDetection } from '../models/objectDetection';
import { Bbox } from './types';

export function getBbox(detection?: IDetection): Bbox | undefined {
    return detection ? detection.bbox : undefined;
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

export function checkAngle(
    point1: Keypoint,
    point2: Keypoint,
    point3: Keypoint,
    inf: number,
    sup: number,
): boolean {
    const angle = (180 * getAngle(point1, point2, point3)) / Math.PI;
    return angle >= inf && angle <= sup;
}

function getAngle(
    pointA: Keypoint,
    pointB: Keypoint,
    pointC: Keypoint,
): number {
    const sideC = Math.hypot(
        pointA.position.x - pointB.position.x,
        pointA.position.y - pointB.position.y,
    );
    const sideA = Math.hypot(
        pointB.position.x - pointC.position.x,
        pointB.position.y - pointC.position.y,
    );
    const sideB = Math.hypot(
        pointC.position.x - pointA.position.x,
        pointC.position.y - pointA.position.y,
    );

    return Math.acos(
        (Math.pow(sideC, 2) + Math.pow(sideA, 2) - Math.pow(sideB, 2)) /
            (2 * sideC * sideA),
    );
}
