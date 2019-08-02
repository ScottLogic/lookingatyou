import convert from 'color-convert';
import {
    eyeCoords,
    idleMovementConsts,
    lightConsts,
} from '../../../AppConstants';

export function analyseLight(image: ImageData): number {
    if (!image) {
        return 0;
    }

    const data = image.data;

    let colorSum = 0;
    for (let i = 0; i < data.length; i += 4) {
        const pixelL = convert.rgb.lab([data[i], data[i + 1], data[i + 2]])[0];
        colorSum += pixelL;
    }

    const brightness = Math.floor(colorSum / (image.width * image.height));
    return Math.min(brightness, lightConsts.maxBrightness);
}

export function naturalMovement(currentX: number, isMovingLeft: boolean) {
    const eyeBoundary = 1 - idleMovementConsts.sideBuffer;

    if (currentX === eyeCoords.middleX) {
        return Math.random() < idleMovementConsts.moveCenterChance
            ? newEyePos(currentX, isMovingLeft)
            : { newX: currentX, isMovingLeft };
    } else if (Math.abs(currentX) >= eyeBoundary) {
        return Math.random() < idleMovementConsts.moveSideChance
            ? newEyePos(currentX, !isMovingLeft)
            : { newX: currentX, isMovingLeft };
    } else {
        return newEyePos(currentX, isMovingLeft);
    }
}

function newEyePos(currentX: number, isMovingLeft: boolean) {
    let xDelta = idleMovementConsts.xDelta;
    xDelta = isMovingLeft ? 0 - xDelta : xDelta;
    return { newX: currentX + xDelta, isMovingLeft };
}
