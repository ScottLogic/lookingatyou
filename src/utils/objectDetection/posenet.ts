import {
    getBoundingBox,
    load,
    partIds,
    Pose,
    PoseNet,
} from '@tensorflow-models/posenet';
import {
    Detection,
    DetectionModelType,
    IObjectDetector,
} from '../../models/objectDetection';
import { DetectionImage } from '../types';

export default class Posenet implements IObjectDetector {
    static async init(): Promise<IObjectDetector> {
        const model = await load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            multiplier: 0.75,
            inputResolution: 257,
        });
        return new Posenet(model);
    }

    static reshapeDetections(detections: Pose[]): Detection[] {
        return detections.map(detection => {
            const keypoints = detection.keypoints;
            const box = getBoundingBox([
                keypoints[partIds.leftEye],
                keypoints[partIds.rightEye],
            ]);
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
    private constructor(private model: PoseNet) {}

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
