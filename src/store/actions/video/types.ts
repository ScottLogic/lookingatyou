export const SET_VIDEO = 'SET_VIDEO';
export const SET_VIDEO_STREAMS = 'SET_VIDEO_STREAMS';
export const TOGGLE_WEBCAM_AVAILABLE = 'TOGGLE_WEBCAM_AVAILABLE';
export const SET_IMAGE_DATA = 'SET_IMAGE_DATA';

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

interface ISetVideoAction {
    readonly type: typeof SET_VIDEO;
    readonly payload: ISetVideoPayload;
}

interface ISetVideoStreamsAction {
    readonly type: typeof SET_VIDEO_STREAMS;
    readonly payload: { [deviceId: string]: IVideo };
}

interface IToggleWebcamAvailable {
    readonly type: typeof TOGGLE_WEBCAM_AVAILABLE;
}

interface ISetImageDataAction {
    readonly type: typeof SET_IMAGE_DATA;
    readonly payload: {
        [key: string]: ImageData;
    };
}

export type VideoActionTypes =
    | ISetVideoAction
    | ISetVideoStreamsAction
    | IToggleWebcamAvailable
    | ISetImageDataAction;
