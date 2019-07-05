import {
    buffer,
    dilationMultipler,
    dilationOffset,
    maxBrightness,
    middleX,
    moveSize,
    xIncrement,
} from '../../AppConstants';

export function checkLight(
    doc: Document,
    tooBright: boolean,
    video:
        | ImageData
        | HTMLImageElement
        | HTMLCanvasElement
        | HTMLVideoElement
        | null,
    analyse: (
        canvas: HTMLCanvasElement,
        tooBright: boolean,
    ) => { tooBright: boolean; scaledPupilSize: number },
): { tooBright: boolean; scaledPupilSize: number } {
    if (video && video instanceof HTMLVideoElement) {
        const canvas = doc.createElement('canvas');
        canvas.height = video.height;
        canvas.width = video.width;
        const canvasCtx = canvas.getContext('2d');

        if (canvasCtx) {
            canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
        return analyse(canvas, tooBright);
    }
    return { tooBright: false, scaledPupilSize: 0 };
}

export function analyseLight(
    canvas: HTMLCanvasElement,
    tooBright: boolean,
): { tooBright: boolean; scaledPupilSize: number } {
    const ctx = canvas.getContext('2d');

    if (ctx && canvas.width > 0) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const data = imageData.data;

        let colorSum = 0;

        for (let i = 0; i < data.length; i += 4) {
            const avg = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);

            colorSum += avg;
        }

        let brightness = Math.floor(colorSum / (canvas.width * canvas.height));

        if (brightness > maxBrightness) {
            tooBright = true;
            brightness = maxBrightness;
        } else if (tooBright) {
            tooBright = false;
        }

        const scaledPupilSize =
            ((maxBrightness - brightness) / maxBrightness) * dilationMultipler +
            dilationOffset;

        return { tooBright, scaledPupilSize };
    }
    return { tooBright: false, scaledPupilSize: 0 };
}

export function naturalMovement(
    currentX: number,
    left: boolean,
): { newX: number; left: boolean } {
    if (currentX === middleX) {
        if (Math.random() < 0.1) {
            return moveEye(currentX, left);
        }
        return { newX: 0, left };
    } else {
        return moveEye(currentX, left);
    }
}

function moveEye(
    currentX: number,
    left: boolean,
): { newX: number; left: boolean } {
    if (left) {
        return moveLeft(currentX, left);
    } else {
        return moveRight(currentX, left);
    }
}

function moveLeft(
    currentX: number,
    left: boolean,
): { newX: number; left: boolean } {
    if (currentX > middleX - xIncrement + buffer) {
        return { newX: currentX - moveSize, left };
    } else if (Math.random() < 0.5) {
        return { newX: currentX + moveSize, left: !left };
    }
    return { newX: currentX, left };
}

function moveRight(
    currentX: number,
    left: boolean,
): { newX: number; left: boolean } {
    if (currentX < middleX + xIncrement - buffer) {
        return { newX: currentX + moveSize, left };
    } else if (Math.random() < 0.5) {
        return { newX: currentX - moveSize, left: !left };
    }
    return { newX: currentX, left };
}
