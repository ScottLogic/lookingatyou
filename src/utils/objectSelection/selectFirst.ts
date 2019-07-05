import { ICocoInfo, IDetection } from '../../models/objectDetection';
import { Bbox } from '../types';

export default function selectFirst(
    detections: IDetection[],
): Bbox | undefined {
    const selection = detections.find(detection => {
        switch (detection.model) {
            case 'CocoSSD':
                return (detection.info as ICocoInfo).type === 'person';
            case 'Posenet':
                return true;
            default:
                return false;
        }
    });

    if (selection) {
        return selection.bbox;
    }
}
