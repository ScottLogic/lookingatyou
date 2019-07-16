import { Bbox, ICoords } from '../types';

export default function calculateTargetPos(bbox: Bbox): ICoords {
    const [x, y, width, height] = bbox;
    return { x: x + width / 2, y: y + height / 4 };
}

export function calculateNormalisedPos(
    bbox: Bbox,
    width: number,
    height: number,
): ICoords {
    const position = calculateTargetPos(bbox);
    return {
        x: normalise(position.x, width),
        y: normalise(position.y, height),
    };
}

export function normalise(
    val: number,
    max: number,
    min: number = 0,
    newMax: number = 1,
    newMin: number = -1,
): number {
    const normalised = (val - min) / (max - min);
    return normalised * (newMax - newMin) + newMin;
}
