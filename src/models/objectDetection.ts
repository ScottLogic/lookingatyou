import { DetectedObject as ssdObject } from '@tensorflow-models/coco-ssd';
import { Pose } from '@tensorflow-models/posenet';
import { Bbox, DetectionImage } from '../utils/types';

export interface IObjectDetector {
    detect(image: DetectionImage): Promise<Detection[]>;
}

export type DetectedObject = ssdObject | Pose;

export type Detection = ICocoSSDDetection | IPosenetDetection;

export enum DetectionModelType {
    Posenet = 'posenet',
    CocoSSD = 'cocossd',
}

export interface IDetection {
    model: DetectionModelType;
    bbox: Bbox;
}

export interface IDetections {
    left: Detection[];
    right: Detection[];
}

export interface ISelections {
    left?: Bbox;
    right?: Bbox;
}

export interface ICocoSSDDetection extends IDetection {
    model: DetectionModelType.CocoSSD;
    info: ICocoInfo;
}

export interface IPosenetDetection extends IDetection {
    model: DetectionModelType.Posenet;
    info: Pose;
}

export interface ICocoInfo {
    certainty: number;
    type: string;
}
