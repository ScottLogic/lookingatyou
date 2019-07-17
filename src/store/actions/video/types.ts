export const SET_VIDEO = 'SET_VIDEO';
export const SET_VIDEO_STREAMS = 'SET_VIDEO_STREAMS';
export const SET_IMAGE_DATA = 'SET_IMAGE_DATA';

export interface IVideo {
    deviceId: string;
    video?: HTMLVideoElement | undefined;
    width: number;
    height: number;
    stream: MediaStream | undefined;
}

export interface IVideoState {
    videos: { [deviceId: string]: IVideo };
    images: { [key: string]: ImageData };
}

export interface ISetVideoPayload {
    video: HTMLVideoElement;
    deviceId: string;
}

interface ISetVideoAction {
    type: typeof SET_VIDEO;
    payload: ISetVideoPayload;
}

interface ISetVideoStreamsAction {
    type: typeof SET_VIDEO_STREAMS;
    videos: IVideo[];
}

interface ISetImageDataAction {
    type: typeof SET_IMAGE_DATA;
    images: {
        [key: string]: ImageData;
    };
}

export type VideoActionTypes =
    | ISetVideoAction
    | ISetVideoStreamsAction
    | ISetImageDataAction;
