import { Bbox, ICoords } from '../types';

export default function calculateTargetPos(bbox: Bbox): ICoords | undefined {
    if (bbox) {
        const [x, y, width, height] = bbox;
        return { x: x + width / 2, y: y + (height * 3) / 4 };
    }
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
