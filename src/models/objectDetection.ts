import { Pose } from '@tensorflow-models/posenet';
import { Bbox, DetectionImage } from '../utils/types';

export interface IObjectDetector {
    detect(image: DetectionImage): Promise<IDetection[]>;
}

export type DetectedObject = Pose;

export interface IDetection {
    bbox: Bbox;
    info: Pose;
}

export interface IDetections {
    left: IDetection[];
    right: IDetection[];
}

export interface ISelections {
    left?: Bbox;
    right?: Bbox;
}
