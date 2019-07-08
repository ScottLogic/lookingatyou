import * as ssd from '@tensorflow-models/coco-ssd';
import * as posenet from '@tensorflow-models/posenet';
import { Bbox, DetectionImage } from '../utils/types';

export interface IObjectDetector {
    reshapeDetections(detections: DetectedObject[]): IDetection[];
    detect(image: DetectionImage): Promise<IDetection[]>;
}

export type DetectedObject = ssd.DetectedObject | posenet.Pose;

export enum DetectionModelType {
    CocoSSD = 'CocoSSD',
    Posenet = 'Posenet',
}

export interface IDetection {
    model: DetectionModelType;
    bbox: Bbox;
}

export interface IDetections {
    left: IDetection[];
    right: IDetection[] | null;
}

export interface ISelections {
    left: Bbox;
    right: Bbox | null;
}

export interface ICocoSSDDetection extends IDetection {
    model: DetectionModelType.CocoSSD;
    info: ICocoInfo;
}

export interface IPosenetDetection extends IDetection {
    model: DetectionModelType.Posenet;
    info: posenet.Pose;
}

export interface ICocoInfo {
    certainty: number;
    type: string;
}
