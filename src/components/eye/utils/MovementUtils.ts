import {
    eyeCoords,
    idleMovementConsts,
    irisSkewFactor,
    lightConsts,
} from '../../../AppConstants';
import { normalise } from '../../../utils/objectTracking/calculateFocus';

export function analyseLight(
    image: ImageData,
): { tooBright: boolean; scaledPupilSize: number } {
    if (image) {
        const data = image.data;

        let colorSum = 0;
        for (let i = 0; i < data.length; i += 4) {
            const avg = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);
            colorSum += avg;
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
    return { tooBright: false, scaledPupilSize: 0 };
}

export function naturalMovement(currentX: number, isMovingLeft: boolean) {
    const eyeBoundary = 1 - idleMovementConsts.sideBuffer;

    if (currentX === eyeCoords.middleX) {
        return Math.random() < idleMovementConsts.moveCenterChance
            ? newEyePos(currentX, isMovingLeft)
            : { newX: currentX, isMovingLeft };
    } else if (currentX >= eyeBoundary) {
        return Math.random() < idleMovementConsts.moveSideChance
            ? newEyePos(currentX, !isMovingLeft)
            : { newX: currentX, isMovingLeft };
    } else {
        return newEyePos(currentX, isMovingLeft);
    }
}

export function newEyePos(currentX: number, isMovingLeft: boolean) {
    let xDelta = idleMovementConsts.xDelta;
    xDelta = isMovingLeft ? -xDelta : xDelta;
    return { newX: currentX + xDelta, isMovingLeft };
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
    const displacement = Math.hypot(width / 2 - x, height / 2 - y);
    const maxDisplacement = getMaxDisplacement(scleraRadius, irisRadius);

    const scale =
        irisSkewFactor +
        ((1 - irisSkewFactor) * (maxDisplacement - displacement)) /
            maxDisplacement;

    let angle = (Math.atan2(height / 2 - y, width / 2 - x) * 180) / Math.PI;

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

export function generateInnerPath(radius: number, sectors: number) {
    const innerRadius = radius * 0.1;
    const outerRadius = radius * 0.9;
    const radianStep = (2 * Math.PI) / sectors;
    const innerOffset = -radianStep / 2;

    let currInnerPath = 'M 0 0';
    for (let i = 0; i < sectors; i++) {
        const currRadianStep = radianStep * i;
        const lineOut = `L ${outerRadius *
            Math.cos(currRadianStep + innerOffset)} ${outerRadius *
            Math.sin(currRadianStep + innerOffset)}`;

        const lineIn = `L ${innerRadius *
            Math.cos(currRadianStep)} ${innerRadius *
            Math.sin(currRadianStep)}`;

        currInnerPath += lineOut;
        currInnerPath += lineIn;
    }
    return currInnerPath;
}
