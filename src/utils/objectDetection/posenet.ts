import {
    getBoundingBox,
    load,
    partIds,
    Pose,
    PoseNet,
} from '@tensorflow-models/posenet';
import { IDetection } from '../../models/objectDetection';
import { DetectionImage } from '../types';

export default class Posenet {
    static async init(): Promise<Posenet> {
        const model = await load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            multiplier: 0.75,
            inputResolution: 257,
        });
        return new Posenet(model);
    }

    static reshapeDetections(detections: Pose[]): IDetection[] {
        return detections.map(detection => {
            const keypoints = detection.keypoints;
            const box = getBoundingBox([
                keypoints[partIds.leftEye],
                keypoints[partIds.rightEye],
            ]);
            return {
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
    private constructor(private model: PoseNet) {}

    async detect(image: DetectionImage): Promise<IDetection[]> {
        const detections = await this.model.estimateMultiplePoses(image, {
            flipHorizontal: false,
            maxDetections: 5,
            scoreThreshold: 0.5,
            nmsRadius: 20,
        });
        return Posenet.reshapeDetections(detections);
    }
}
