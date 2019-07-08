import { IDetection } from '../../../models/objectDetection';
import calculateTargetPos from '../../objectTracking/calculateFocus';
import { Bbox, ICoords } from '../../types';
export default function matchYPosition(
    leftEyeSelection: Bbox,
    rightEyeDetections: IDetection[],
    maxIndex = rightEyeDetections.length,
): Bbox | undefined {
    const rightEyePersonBboxes: Bbox[] = rightEyeDetections
        .filter(detection => detection.info.type === 'person')
        .map(detection => detection.bbox);
    if (rightEyePersonBboxes.length === 0) {
        return undefined;
    }
    const leftEyeCoord = calculateTargetPos(leftEyeSelection);
    const rightEyePersonCoords: ICoords[] = rightEyePersonBboxes.map(bbox =>
        calculateTargetPos(bbox),
    );
    let best: number | null = null;
    let lowestYDifference = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < rightEyePersonCoords.length && i < maxIndex; i++) {
        const isClosestYValue =
            yDifference(rightEyePersonCoords[i], leftEyeCoord) <
            lowestYDifference;
        const isOnLeft = isLeftof(rightEyePersonCoords[i], leftEyeCoord);
        if (isClosestYValue && isOnLeft) {
            best = i;
            lowestYDifference = yDifference(
                rightEyePersonCoords[best],
                leftEyeCoord,
            );
        }
    }
    return best !== null ? rightEyePersonBboxes[best] : undefined;
}
function isLeftof(coords1: ICoords, coords2: ICoords) {
    return coords1.x < coords2.x;
}
function yDifference(coords1: ICoords, coords2: ICoords) {
    return Math.abs(coords1.y - coords2.y);
}
