import {
    DetectionModelType,
    ICocoSSDDetection,
    IDetection,
} from '../../models/objectDetection';

export default function selectFirst(
    detections: IDetection[],
): IDetection | undefined {
    return detections.find(detection => {
        switch (detection.model) {
            case DetectionModelType.CocoSSD:
                return (detection as ICocoSSDDetection).info.type === 'person';
            case DetectionModelType.Posenet:
                return true;
            default:
                return false;
        }
    });
}
