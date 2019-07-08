export type Bbox = [number, number, number, number];

export interface ICoords {
    x: number;
    y: number;
}

export interface ITargets {
    left: ICoords;
    right: ICoords | undefined;
}

export interface ISelections {
    left: Bbox;
    right: Bbox | undefined;
}

export type DetectionImage =
    | HTMLVideoElement
    | HTMLImageElement
    | HTMLCanvasElement
    | ImageData;
