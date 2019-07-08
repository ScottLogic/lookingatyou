import {
    DetectionModelType,
    ICocoSSDDetection,
    IDetection,
} from '../../models/objectDetection';

export function isPerson(detection: IDetection): boolean {
    switch (detection.model) {
        case DetectionModelType.CocoSSD:
            return (detection as ICocoSSDDetection).info.type === 'person';
        case DetectionModelType.Posenet:
            return true;
        default:
            return false;
    }
}
