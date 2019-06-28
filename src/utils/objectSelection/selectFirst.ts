import { IDetection } from '../interfaces';
import { Bbox } from '../types';

export default function selectFirst(detections: IDetection[]): Bbox {
    const selection = detections.find(detection => {
        return detection.info.type === 'person';
    });
    if (selection) {
        return selection.bbox;
    }
}
