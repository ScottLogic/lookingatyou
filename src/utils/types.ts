export type Bbox = [number, number, number, number];

export interface ICoords {
    x: number;
    y: number;
}

export interface IColour {
    r: number;
    g: number;
    b: number;
}

export interface IHistory {
    colour: IColour;
    target: ICoords;
}

export type DetectionImage =
    | HTMLVideoElement
    | HTMLImageElement
    | HTMLCanvasElement
    | ImageData;
