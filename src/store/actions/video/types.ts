export const SET_VIDEO = 'SET_VIDEO';
export const SET_VIDEO_STREAM = 'SET_VIDEO_STREAM';
export const TOGGLE_WEBCAM_AVAILABLE = 'TOGGLE_WEBCAM_AVAILABLE';
export const SET_IMAGE_DATA = 'SET_IMAGE_DATA';

export enum VideoSetAction {
    VIDEO = 'SET_VIDEO',
    VIDEO_STREAM = 'SET_VIDEO_STREAM',
    TOGGLE_WEBCAM = 'TOGGLE_WEBCAM_AVAILABLE',
    IMAGE_DATA = 'SET_IMAGE_DATA',
}

export interface IVideo {
    width: number;
    height: number;
    videoElement?: HTMLVideoElement;
    stream?: MediaStream;
}

export interface IVideoState {
    webcamAvailable: boolean;
    video: IVideo;
    image: ImageData;
}

export interface ISetVideoAction {
    readonly type: typeof SET_VIDEO;
    readonly payload: HTMLVideoElement;
}

export interface ISetVideoStreamAction {
    readonly type: typeof SET_VIDEO_STREAM;
    readonly payload: IVideo;
}

export interface IToggleWebcamAvailable {
    readonly type: typeof TOGGLE_WEBCAM_AVAILABLE;
}

export interface ISetImageDataAction {
    readonly type: typeof SET_IMAGE_DATA;
    readonly payload: ImageData;
}

export type VideoAction =
    | ISetVideoAction
    | ISetVideoStreamAction
    | IToggleWebcamAvailable
    | ISetImageDataAction;
