import { ICoords } from '../interfaces';
import { Bbox } from '../types';

export default function calculateTargetPos(bbox: Bbox): ICoords | undefined {
    if (bbox) {
        const [x, y, width, height] = bbox;
        return { x: (x + width) / 2, y: ((y + height) / 4) * 3 };
    }
}

export function normalize(
    val: number,
    max: number,
    min: number = 0,
    newMin: number = -1,
    newMax: number = 1,
): number {
    const normalized = (val - min) / (max - min);
    return normalized * (newMax - newMin) + newMin;
}
