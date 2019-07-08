import { IDetection } from '../../models/objectDetection';
import { isPerson } from './detectionSelector';

export default function selectFirst(
    detections: IDetection[],
): IDetection | undefined {
    return detections.find(detection => {
        return isPerson(detection);
    });
}
