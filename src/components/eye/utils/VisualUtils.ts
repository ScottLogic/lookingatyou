import { irisSkewFactor } from "../../../AppConstants";

export function getMaxDisplacement(scleraRadius: number, irisRadius: number) {
    return (scleraRadius - irisRadius * irisSkewFactor) / irisSkewFactor;
}

export interface IIrisAdjustment {
    scale: number;
    angle: number;
}
export function getIrisAdjustment(
    x: number,
    y: number,
    height: number,
    width: number,
    scleraRadius: number,
    irisRadius: number,
    previousAngle: number = 0,
): IIrisAdjustment {
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
