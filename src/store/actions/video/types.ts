export const SET_VIDEO = 'SET_VIDEO';
export const SET_VIDEO_STREAMS = 'SET_VIDEO_STREAMS';
export const CLEAR_STATE = 'CLEAR_STATE';
export const TOGGLE_WEBCAM_AVAILABLE = 'TOGGLE_WEBCAM_AVAILABLE';

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
    type: typeof SET_VIDEO;
    payload: ISetVideoPayload;
}

interface ISetVideoStreamsAction {
    type: typeof SET_VIDEO_STREAMS;
    videos: { [deviceId: string]: IVideo };
}

interface IToggleWebcamAvailable {
    type: typeof TOGGLE_WEBCAM_AVAILABLE;
}

export type VideoActionTypes =
    | ISetVideoAction
    | ISetVideoStreamsAction
    | IToggleWebcamAvailable;
