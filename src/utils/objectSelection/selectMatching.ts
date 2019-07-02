import { ICoords } from '../types';
export default function selectMatching(
    leftEyeCoord: ICoords,
    rightEyeCoords: ICoords[],
    maxIndex = rightEyeCoords.length,
) {
    let best = 0;
    let lowestYDifference = yDifference(rightEyeCoords[best], leftEyeCoord);
    for (let i = 1; i < rightEyeCoords.length && i < maxIndex; i++) {
        if (
            yDifference(rightEyeCoords[i], leftEyeCoord) < lowestYDifference &&
            isLeftOf(rightEyeCoords[i], leftEyeCoord)
        ) {
            best = i;
            lowestYDifference = yDifference(rightEyeCoords[best], leftEyeCoord);
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
