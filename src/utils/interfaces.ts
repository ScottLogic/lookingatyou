import { Bbox, DetectionConfig, DetectionImage } from './types';

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
