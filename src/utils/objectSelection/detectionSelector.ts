import { Detection, DetectionModelType } from '../../models/objectDetection';

export function isPerson(detection: Detection): boolean {
    switch (detection.model) {
        case DetectionModelType.CocoSSD:
            return detection.info.type === 'person';
        case DetectionModelType.Posenet:
            return true;
        default:
            return false;
    }
}
