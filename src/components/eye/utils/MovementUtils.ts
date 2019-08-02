import {
    eyeCoords,
    idleMovementConsts,
    lightConsts,
} from '../../../AppConstants';
import { normalise } from '../../../utils/objectTracking/calculateFocus';

export function analyseLight(
    image: ImageData,
): { tooBright: boolean; scaledPupilSize: number } {
    if (!image) {
        return { tooBright: false, scaledPupilSize: 0 };
    }

    const data = image.data;

    let colorSum = 0;
    for (let i = 0; i < data.length; i += 4) {
        const average = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);
        colorSum += average;
    }

    let brightness = Math.floor(colorSum / (image.width * image.height));
    brightness = Math.min(brightness, lightConsts.maxBrightness);

    const scaledPupilSize = normalise(
        lightConsts.maxBrightness - brightness,
        lightConsts.maxBrightness,
        0,
        lightConsts.dilationMultipler + lightConsts.dilationOffset,
        lightConsts.dilationOffset,
    );

    return {
        tooBright: lightConsts.maxBrightness === brightness,
        scaledPupilSize,
    };
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
