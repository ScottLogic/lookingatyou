export type Bbox = [number, number, number, number] | undefined;

export interface ICoords {
    x: number;
    y: number;
}

export interface ITargets {
    left: ICoords;
    right: ICoords | null;
}

export type DetectionImage =
    | HTMLVideoElement
    | HTMLImageElement
    | HTMLCanvasElement
    | ImageData;
