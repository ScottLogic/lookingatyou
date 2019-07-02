import * as ssd from '@tensorflow-models/coco-ssd';
import { eyelidPosition } from '../../AppConstants';
import { analyseLight, checkLight } from '../../components/eye/EyeUtils';
import { IDetection, IObjectDetector } from '../../models/objectDetection';
import { DetectionImage } from '../types';

export default class CocoSSD implements IObjectDetector {
    static async init(
        baseModel: ssd.ObjectDetectionBaseModel = 'lite_mobilenet_v2',
    ): Promise<IObjectDetector> {
        const model = await ssd.load(baseModel);
        return new CocoSSD(model);
    }

    private constructor(private model: ssd.ObjectDetection) {}

    async detect(
        image: DetectionImage,
        maxDetections: number = 5,
    ): Promise<IDetection[]> {
        const { tooBright, scaledPupilSize } = checkLight(
            this.state.tooBright,
            image,
            analyseLight,
        );

        if (tooBright) {
            this.setState({
                tooBright: true,
                eyesOpenCoefficient: eyelidPosition.CLOSED,
            });
        } else if (this.state.tooBright) {
            this.setState({
                tooBright: false,
                eyesOpenCoefficient: eyelidPosition.OPEN,
            });
        }

        this.setState({ dilationCoefficient: scaledPupilSize });

        const detections = await this.model.detect(image, maxDetections);
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
