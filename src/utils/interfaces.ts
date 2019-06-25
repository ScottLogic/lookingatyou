<<<<<<< HEAD
import { Bbox, DetectionConfig, DetectionImage } from './types';
=======
import { Bbox, DetectionConfig, DetectionImage, ModelConfig } from './types';
>>>>>>> refactored object detection to be modular

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

export interface ICoords {
    x: number;
    y: number;
}
