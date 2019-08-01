export const SET_VIDEO = 'SET_VIDEO';
export const SET_VIDEO_STREAMS = 'SET_VIDEO_STREAMS';
export const TOGGLE_WEBCAM_AVAILABLE = 'TOGGLE_WEBCAM_AVAILABLE';
export const SET_IMAGE_DATA = 'SET_IMAGE_DATA';

export enum VideoSetAction {
    VIDEO = 'SET_VIDEO',
    VIDEO_STREAMS = 'SET_VIDEO_STREAMS',
    TOGGLE_WEBCAM = 'TOGGLE_WEBCAM_AVAILABLE',
    IMAGE_DATA = 'SET_IMAGE_DATA',
}

export interface IVideo {
    deviceId: string;
    video?: HTMLVideoElement | undefined;
    width: number;
    height: number;
    stream: MediaStream | undefined;
}

export interface IVideoState {
    webcamAvailable: boolean;
    videos: { [deviceId: string]: IVideo };
    images: { [key: string]: ImageData };
}

export interface ISetVideoPayload {
    video: HTMLVideoElement;
    deviceId: string;
}

export interface ISetVideoAction {
    readonly type: typeof SET_VIDEO;
    readonly payload: ISetVideoPayload;
}

export interface ISetVideoStreamsAction {
    readonly type: typeof SET_VIDEO_STREAMS;
    readonly payload: { [deviceId: string]: IVideo };
}

export interface IToggleWebcamAvailable {
    readonly type: typeof TOGGLE_WEBCAM_AVAILABLE;
}

export interface ISetImageDataAction {
    readonly type: typeof SET_IMAGE_DATA;
    readonly payload: {
        [key: string]: ImageData;
    };
}

export type VideoAction =
    | ISetVideoAction
    | ISetVideoStreamsAction
    | IToggleWebcamAvailable
    | ISetImageDataAction;
