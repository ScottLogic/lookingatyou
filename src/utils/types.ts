export type Bbox = [number, number, number, number];

export interface ICoords {
    x: number;
    y: number;
}

export type DetectionImage =
    | HTMLVideoElement
    | HTMLImageElement
    | HTMLCanvasElement
    | ImageData;
