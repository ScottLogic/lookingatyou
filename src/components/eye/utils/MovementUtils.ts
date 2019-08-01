import {
    eyeCoords,
    idleMovementConsts,
    lightConsts,
} from '../../../AppConstants';

export function analyseLight(
    image: ImageData,
    tooBright: boolean,
): { tooBright: boolean; scaledPupilSize: number } {
    if (image.width > 0) {
        const data = image.data;
        let colorSum = 0;
        for (let i = 0; i < data.length; i += 4) {
            const avg = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);

            colorSum += avg;
        }
        let brightness = Math.floor(colorSum / (image.width * image.height));

        if (brightness > lightConsts.maxBrightness) {
            tooBright = true;
            brightness = lightConsts.maxBrightness;
        } else if (tooBright) {
            tooBright = false;
        }
        const scaledPupilSize =
            ((lightConsts.maxBrightness - brightness) /
                lightConsts.maxBrightness) *
                lightConsts.dilationMultipler +
            lightConsts.dilationOffset;

        return { tooBright, scaledPupilSize };
    }
    return { tooBright: false, scaledPupilSize: 0 };
}

export function naturalMovement(
    currentX: number,
    isMovingLeft: boolean,
): { newX: number; isMovingLeft: boolean } {
    if (currentX === eyeCoords.middleX) {
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
    if (currentX > eyeCoords.middleX - 1 + idleMovementConsts.sideBuffer) {
        return { newX: currentX - idleMovementConsts.xDelta, isMovingLeft };
    } else if (Math.random() < 0.5) {
        return {
            newX: currentX + idleMovementConsts.xDelta,
            isMovingLeft: !isMovingLeft,
        };
    }
    return { newX: currentX, isMovingLeft };
}

function moveRight(
    currentX: number,
    isMovingLeft: boolean,
): { newX: number; isMovingLeft: boolean } {
    if (currentX < eyeCoords.middleX + 1 - idleMovementConsts.sideBuffer) {
        return { newX: currentX + idleMovementConsts.xDelta, isMovingLeft };
    } else if (Math.random() < 0.5) {
        return {
            newX: currentX - idleMovementConsts.xDelta,
            isMovingLeft: !isMovingLeft,
        };
    }
    return { newX: currentX, isMovingLeft };
}
