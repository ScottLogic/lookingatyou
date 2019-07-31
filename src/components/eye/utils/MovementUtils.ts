import {
    eyeCoords,
    idleMovementConsts,
    lightConsts,
    minIrisScale,
} from '../../../AppConstants';
import { normalise } from '../../../utils/objectTracking/calculateFocus';
import { ICoords } from '../../../utils/types';

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
    } else if (Math.abs(currentX) >= eyeBoundary) {
        return Math.random() < idleMovementConsts.moveSideChance
            ? newEyePos(currentX, !isMovingLeft)
            : { newX: currentX, isMovingLeft };
    } else {
        return newEyePos(currentX, isMovingLeft);
    }
}

export function newEyePos(currentX: number, isMovingLeft: boolean) {
    let xDelta = idleMovementConsts.xDelta;
    xDelta = isMovingLeft ? 0 - xDelta : xDelta;
    return { newX: currentX + xDelta, isMovingLeft };
}

export function irisSkewMatrixTransform(position: ICoords) {
    const radius = Math.hypot(position.x, position.y);
    if (radius === 0) {
        return '';
    }

    const scale =
        minIrisScale + normalise(1 - radius, 1, 0, 1 - minIrisScale, 0);
    const xDivR = position.x / radius;
    const yDivR = position.y / radius;

    const xScale = scale * Math.pow(xDivR, 2) + Math.pow(yDivR, 2);
    const skew = (1 - scale) * xDivR * yDivR;
    const matrix = `matrix(${xScale},${skew},${skew},1,0,0)`;
    return matrix;
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
