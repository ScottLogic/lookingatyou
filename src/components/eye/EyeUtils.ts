import {
    buffer,
    dilationMultipler,
    dilationOffset,
    irisSkewFactor,
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
    isMovingLeft: boolean,
): { newX: number; isMovingLeft: boolean } {
    if (currentX === middleX) {
        if (Math.random() < 0.1) {
            return moveEye(currentX, isMovingLeft);
        }
        return { newX: 0, isMovingLeft };
    } else {
        return moveEye(currentX, isMovingLeft);
    }
}

function moveEye(
    currentX: number,
    isMovingLeft: boolean,
): { newX: number; isMovingLeft: boolean } {
    if (isMovingLeft) {
        return moveLeft(currentX, isMovingLeft);
    } else {
        return moveRight(currentX, isMovingLeft);
    }
}

function moveLeft(
    currentX: number,
    isMovingLeft: boolean,
): { newX: number; isMovingLeft: boolean } {
    if (currentX > middleX - xIncrement + buffer) {
        return { newX: currentX - moveSize, isMovingLeft };
    } else if (Math.random() < 0.5) {
        return { newX: currentX + moveSize, isMovingLeft: !isMovingLeft };
    }
    return { newX: currentX, isMovingLeft };
}

function moveRight(
    currentX: number,
    isMovingLeft: boolean,
): { newX: number; isMovingLeft: boolean } {
    if (currentX < middleX + xIncrement - buffer) {
        return { newX: currentX + moveSize, isMovingLeft };
    } else if (Math.random() < 0.5) {
        return { newX: currentX - moveSize, isMovingLeft: !isMovingLeft };
    }
    return { newX: currentX, isMovingLeft };
}

export function getMaxDisplacement(scleraRadius: number, irisRadius: number) {
    return (scleraRadius - irisRadius * irisSkewFactor) / irisSkewFactor;
}

export function getIrisAdjustment(
    x: number,
    y: number,
    height: number,
    width: number,
    scleraRadius: number,
    irisRadius: number,
    previousAngle: number = 0,
) {
    const displacement = Math.hypot(x - width / 2, y - height / 2);
    const maxDisplacement = getMaxDisplacement(scleraRadius, irisRadius);

    const scale =
        irisSkewFactor +
        ((1 - irisSkewFactor) * (maxDisplacement - displacement)) /
            maxDisplacement;

    let angle = (Math.atan2(y - height / 2, x - width / 2) * 180) / Math.PI;

    if (angle - previousAngle < -90) {
        angle = angle + 180;
    } else if (angle - previousAngle > 90) {
        angle = angle - 180;
    }

    return {
        scale,
        angle,
    };
}
