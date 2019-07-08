import * as posenet from '@tensorflow-models/posenet';
import {
    DetectionModelType,
    IDetection,
    IObjectDetector,
} from '../../models/objectDetection';
import { DetectionImage } from '../types';

export default class Posenet {
    static async init(): Promise<IObjectDetector> {
        const model = await posenet.load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            multiplier: 0.75,
            inputResolution: 257,
        });
        return new Posenet(model);
    }

    private constructor(private model: posenet.PoseNet) {}

    async detect(image: DetectionImage): Promise<IDetection[]> {
        const detections = await this.model.estimateMultiplePoses(image, {
            flipHorizontal: false,
            maxDetections: 5,
            scoreThreshold: 0.5,
            nmsRadius: 20,
        });
        return this.reshapeDetections(detections);
    }

    reshapeDetections(detections: posenet.Pose[]): IDetection[] {
        return detections.map(detection => {
            const box = posenet.getBoundingBox(detection.keypoints);
            return {
                model: DetectionModelType.Posenet,
                bbox: [
                    box.minX,
                    box.minY,
                    box.maxX - box.minX,
                    box.maxY - box.minY,
                ],
                info: detection,
            };
        });
    }
}
