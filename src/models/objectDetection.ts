import { Pose } from '@tensorflow-models/posenet';
import { Bbox } from '../utils/types';

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
