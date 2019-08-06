export type Bbox = [number, number, number, number];

export interface ICoords {
    x: number;
    y: number;
}

export interface IColor {
    r: number;
    g: number;
    b: number;
}

export interface IHistory {
    color: IColor;
    target: ICoords;
}

export type DetectionImage =
    | HTMLVideoElement
    | HTMLImageElement
    | HTMLCanvasElement
    | ImageData;
