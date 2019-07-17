export type Bbox = [number, number, number, number];

export interface ICoords {
    x: number;
    y: number;
}

export interface ITargets {
    left: ICoords;
    right: ICoords;
}

export type DetectionImage =
    | HTMLVideoElement
    | HTMLImageElement
    | HTMLCanvasElement
    | ImageData;
