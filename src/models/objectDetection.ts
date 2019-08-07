import { Pose } from '@tensorflow-models/posenet';
import { Bbox } from '../utils/types';

export type DetectedObject = Pose;

export interface IDetection {
    bbox: Bbox;
    info: Pose;
}

export type Detections = IDetection[];

export type architectures = 'MobileNetV1' | 'ResNet50';
export type outputStrides = 8 | 16 | 32;
export type multipliers = 0.5 | 0.75 | 1.0;
export type inputResolutions =
    | 161
    | 193
    | 257
    | 289
    | 321
    | 353
    | 385
    | 417
    | 449
    | 481
    | 513
    | 801;
