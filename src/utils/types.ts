export type Bbox = [number, number, number, number] | undefined;

export interface ICoords {
    x: number;
    y: number;
}

export type DetectionImage =
    | HTMLVideoElement
    | HTMLImageElement
    | HTMLCanvasElement
    | ImageData;
