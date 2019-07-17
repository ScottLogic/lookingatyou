import * as posenet from '@tensorflow-models/posenet';
import {
    Detection,
    DetectionModelType,
    IObjectDetector,
} from '../../models/objectDetection';
import { DetectionImage } from '../types';

export default class Posenet implements IObjectDetector {
    static async init(): Promise<IObjectDetector> {
        const model = await posenet.load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            multiplier: 0.75,
            inputResolution: 257,
        });
        return new Posenet(model);
    }

    static reshapeDetections(detections: posenet.Pose[]): Detection[] {
        return detections.map(detection => {
            const box = posenet.getBoundingBox(detection.keypoints.slice(1, 3)); // 1 and 2 correspond nose and eyes
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
    private constructor(private model: posenet.PoseNet) {}

    async detect(image: DetectionImage): Promise<Detection[]> {
        const detections = await this.model.estimateMultiplePoses(image, {
            flipHorizontal: false,
            maxDetections: 5,
            scoreThreshold: 0.5,
            nmsRadius: 20,
        });
        return Posenet.reshapeDetections(detections);
    }
}
