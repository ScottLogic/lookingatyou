import { EyeSide } from '../AppConstants';
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

export function getImageDataFromVideos(
    videos: Array<HTMLVideoElement | undefined>,
): { [key: string]: ImageData } {
    let images: { [key: string]: ImageData } = {};
    const leftImage = getImageData(videos[0]);
    if (leftImage) {
        images = { [EyeSide.LEFT]: leftImage };
        if (videos[1]) {
            const rightImage = getImageData(videos[1]);
            if (rightImage) {
                images[EyeSide.RIGHT] = rightImage;
            }
        }
    }
    return images;
}

function getImageData(video: HTMLVideoElement | undefined): ImageData | null {
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
