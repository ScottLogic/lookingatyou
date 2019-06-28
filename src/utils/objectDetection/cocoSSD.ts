import * as ssd from '@tensorflow-models/coco-ssd';
import { IDetection, IObjectDetector } from '../interfaces';
import { DetectionImage } from '../types';

export default class CocoSSD implements IObjectDetector {
    static async init(
        baseModel: ssd.ObjectDetectionBaseModel = 'lite_mobilenet_v2',
    ): Promise<IObjectDetector> {
        const model = await ssd.load(baseModel);
        return new CocoSSD(model);
    }

    private model: ssd.ObjectDetection;

    private constructor(model: ssd.ObjectDetection) {
        this.model = model;
    }

    async detect(
        image: DetectionImage,
        maxDetections: number = 5,
    ): Promise<IDetection[]> {
        const detections = await this.model.detect(image, maxDetections);
        console.log('Image from detect ', image);
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
