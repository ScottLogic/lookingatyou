import { ICoords } from '../types';
export default function selectMatching(
    leftEyeCoord: ICoords,
    rightEyeCoords: ICoords[],
    maxIndex = rightEyeCoords.length,
) {
    let best = 0;
    for (let i = 1; i < rightEyeCoords.length && i < maxIndex; i++) {
        if (
            isLeftOf(rightEyeCoords[i], leftEyeCoord) &&
            yDifference(rightEyeCoords[i], leftEyeCoord) <
                yDifference(rightEyeCoords[best], leftEyeCoord)
        ) {
            best = i;
        }
    }
    return rightEyeCoords[best];
}
function isLeftOf(coords1: ICoords, coords2: ICoords) {
    return coords1.x < coords2.x;
}
function yDifference(coords1: ICoords, coords2: ICoords) {
    return Math.abs(coords1.y - coords2.y);
}
