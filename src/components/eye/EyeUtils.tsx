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
    tooBright: boolean,
    video:
        | ImageData
        | HTMLImageElement
        | HTMLCanvasElement
        | HTMLVideoElement
        | null,
    callback: (
        canvas: HTMLCanvasElement,
        tooBright: boolean,
    ) => [boolean, number],
): [boolean, number] {
    if (video && video instanceof HTMLVideoElement) {
        const canvas = document.createElement('canvas');
        canvas.height = video.height;
        canvas.width = video.width;
        const canvasCtx = canvas.getContext('2d');

        if (canvasCtx) {
            canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
        return callback(canvas, tooBright);
    }
    return [false, 0];
}

export function analyseLight(
    canvas: HTMLCanvasElement,
    tooBright: boolean,
): [boolean, number] {
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

        return [tooBright, scaledPupilSize];
    }
    return [false, 0];
}

export function naturalMovement(
    currentX: number,
    direction: boolean,
): [number, boolean] {
    if (currentX === middleX) {
        if (Math.random() < 0.01) {
            return moveEye(currentX, direction);
        }
        return [0, direction];
    } else {
        return moveEye(currentX, direction);
    }
}

function moveEye(currentX: number, direction: boolean): [number, boolean] {
    if (direction) {
        return moveLeft(currentX, direction);
    } else {
        return moveRight(currentX, direction);
    }
}

function moveLeft(currentX: number, direction: boolean): [number, boolean] {
    if (currentX > middleX - xIncrement + buffer) {
        return [currentX - moveSize, direction];
    } else if (Math.random() < 0.1) {
        return [currentX, !direction];
    }
    return [currentX, direction];
}

function moveRight(currentX: number, direction: boolean): [number, boolean] {
    if (currentX < middleX + xIncrement - buffer) {
        return [currentX + moveSize, direction];
    } else if (Math.random() < 0.1) {
        return [currentX, !direction];
    }
    return [currentX, direction];
}
