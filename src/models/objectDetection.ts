import * as ssd from '@tensorflow-models/coco-ssd';
import * as posenet from '@tensorflow-models/posenet';
import { Bbox, DetectionImage } from '../utils/types';

export interface IObjectDetector {
    reshapeDetections(detections: DetectedObject[]): IDetection[];
    detect(image: DetectionImage): Promise<IDetection[]>;
}

export type DetectedObject = ssd.DetectedObject | posenet.Pose;

export interface IDetection {
    bbox: Bbox;
    info: ICocoInfo | posenet.Pose;
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
