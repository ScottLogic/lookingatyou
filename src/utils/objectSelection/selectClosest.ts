import { IDetection } from '../../models/objectDetection';
import calculateTargetPos from '../objectTracking/calculateFocus';
import { Bbox, ICoords } from '../types';
export default function selectClosest(
    detections: IDetection[],
    coords: ICoords,
): Bbox | undefined {
    const personBboxes = detections
        .filter(detection => detection.info.type === 'person')
        .map(detection => detection.bbox);
    if (personBboxes.length === 0) {
        return undefined;
    }
    let best = 0;
    let bestDistance = getDistance(
        calculateTargetPos(personBboxes[best]),
        coords,
    );
    for (let i = 1; i < personBboxes.length; i++) {
        const distance = getDistance(
            calculateTargetPos(personBboxes[i]),
            coords,
        );
        if (distance < bestDistance) {
            best = i;
            bestDistance = distance;
        }
    }
    return personBboxes[best];
}
function getDistance(coords1: ICoords, coords2: ICoords) {
    return Math.hypot(coords1.x - coords2.x, coords1.y - coords2.y);
}
