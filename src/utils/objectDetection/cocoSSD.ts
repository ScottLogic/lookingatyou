import * as ssd from '@tensorflow-models/coco-ssd';
import { IDetection, IObjectDetector } from '../../models/objectDetection';
import { DetectionImage } from '../types';

const maxDetections = 5;
const baseModel = 'lite_mobilenet_v2';

export default class CocoSSD implements IObjectDetector {
    static async init(): Promise<IObjectDetector> {
        const model = await ssd.load(baseModel);
        return new CocoSSD(model);
    }

    private constructor(private model: ssd.ObjectDetection) {}

    async detect(image: DetectionImage): Promise<IDetection[]> {
        const detections = await this.model.detect(image, maxDetections);
        return this.reshapeDetections(detections);
    }

    reshapeDetections(detections: ssd.DetectedObject[]): IDetection[] {
        return detections.map(detection => {
            return {
                bbox: detection.bbox,
                info: {
                    certainty: detection.score,
                    type: detection.class,
                },
            };
        });
    }
}
