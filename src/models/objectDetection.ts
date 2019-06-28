import * as ssd from '@tensorflow-models/coco-ssd';
import { Bbox, DetectionImage } from '../utils/types';

export interface IObjectDetector {
    detect(
        image: DetectionImage,
        detectionConfig?: DetectionConfig,
    ): Promise<IDetection[]>;
}

export interface IDetection {
    bbox: Bbox;
    info: ICocoInfo;
}

export interface ICocoInfo {
    certainty: number;
    type: string;
}

export type ModelConfig = ssd.ObjectDetectionBaseModel;

export type DetectionConfig = number;
