import { IDetection } from '../../../models/objectDetection';
import calculateTargetPos from '../../objectTracking/calculateFocus';
import { ICoords } from '../../types';
export default function matchYPosition(
    leftEyeCoord: ICoords,
    rightEyeDetections: IDetection[],
    maxIndex = rightEyeDetections.length,
) {
    const rightEyeCoords: ICoords[] = rightEyeDetections
        .filter(detection => detection.info.type === 'person')
        .map(detection => calculateTargetPos(detection.bbox))
        .filter(coords => coords !== undefined) as ICoords[];
    if (rightEyeCoords.length === 0) {
        return null;
    }
    let best: number | null = null;
    let lowestYDifference = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < rightEyeCoords.length && i < maxIndex; i++) {
        if (
            yDifference(rightEyeCoords[i], leftEyeCoord) < lowestYDifference &&
            isRightOf(rightEyeCoords[i], leftEyeCoord)
        ) {
            best = i;
            lowestYDifference = yDifference(rightEyeCoords[best], leftEyeCoord);
        }
    }
    if (best !== null) {
        return rightEyeCoords[best];
    } else {
        return null;
    }
}
function isRightOf(coords1: ICoords, coords2: ICoords) {
    return coords1.x > coords2.x;
}
function yDifference(coords1: ICoords, coords2: ICoords) {
    return Math.abs(coords1.y - coords2.y);
}
