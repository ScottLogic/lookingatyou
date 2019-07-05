import * as ssd from '@tensorflow-models/coco-ssd';
import { Bbox, DetectionImage } from '../utils/types';

export interface IObjectDetector {
    reshapeDetections(testInput: ssd.DetectedObject[]): IDetection[];
    detect(image: DetectionImage): Promise<IDetection[]>;
}

export interface IDetection {
    bbox: Bbox;
    info: ICocoInfo;
}

export interface IDetections {
    left: IDetection[];
    right: IDetection[] | null;
}

export interface ISelections {
    left: Bbox;
    right: Bbox | null;
}

export interface ICocoInfo {
    certainty: number;
    type: string;
}
