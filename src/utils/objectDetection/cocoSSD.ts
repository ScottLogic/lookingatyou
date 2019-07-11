import * as ssd from '@tensorflow-models/coco-ssd';
import {
    Detection,
    DetectionModelType,
    IObjectDetector,
} from '../../models/objectDetection';
import { DetectionImage } from '../types';

const maxDetections = 5;
const baseModel = 'lite_mobilenet_v2';

export default class CocoSSD implements IObjectDetector {
    static async init(): Promise<IObjectDetector> {
        const model = await ssd.load(baseModel);
        return new CocoSSD(model);
    }

    static reshapeDetections(detections: ssd.DetectedObject[]): Detection[] {
        return detections.map(detection => {
            return {
                model: DetectionModelType.CocoSSD,
                bbox: detection.bbox,
                info: {
                    certainty: detection.score,
                    type: detection.class,
                },
            };
        });
    }

    private constructor(private model: ssd.ObjectDetection) {}

    async detect(image: DetectionImage): Promise<Detection[]> {
        const detections = await this.model.detect(image, maxDetections);
        return CocoSSD.reshapeDetections(detections);
    }
}
