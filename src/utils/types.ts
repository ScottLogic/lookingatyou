import * as ssd from '@tensorflow-models/coco-ssd';

export type DetectionImage =
    | HTMLVideoElement
    | HTMLImageElement
    | HTMLCanvasElement
    | ImageData;

export type Bbox = [number, number, number, number] | undefined;

export type ModelConfig = ssd.ObjectDetectionBaseModel;

export type DetectionConfig = number;
