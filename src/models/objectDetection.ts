import { Pose } from '@tensorflow-models/posenet';
import { Bbox } from '../utils/types';

export type DetectedObject = Pose;

export interface IDetection {
    bbox: Bbox;
    info: Pose;
}

export type Detections = IDetection[];

export interface ISelections {
    left?: Bbox;
    right?: Bbox;
}
