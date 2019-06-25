import { IDetection } from '../interfaces';
import { Bbox } from '../types';

export default function selectFirstOfType(
    detections: IDetection[],
    type: string,
): Bbox {
    const possibleTargets = detections.filter(detection => {
        return detection.info.type === type;
    });
    if (possibleTargets.length > 0) {
        return possibleTargets[0].bbox;
    }
}
