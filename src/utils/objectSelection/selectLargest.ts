import { IDetection } from '../../models/objectDetection';
import { Bbox } from '../types';
export default function selectLargest(
    detections: IDetection[],
): Bbox | undefined {
    const personBboxes = detections
        .filter(detection => detection.info.type === 'person')
        .map(detection => detection.bbox);
    if (personBboxes.length === 0) { return undefined; }
    let best = 0;
    let bestArea = getArea(personBboxes[best]);
    for (let i = 1; i < personBboxes.length; i++) {
        const area = getArea(personBboxes[i]);
        if (area > bestArea) {
            best = i;
            bestArea = area;
        }
    }
    return personBboxes[best];
}
function getArea(bbox: Bbox) {
    return bbox[2] * bbox[3];
}
