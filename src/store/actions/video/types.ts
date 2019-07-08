export const SET_VIDEO = 'SET_VIDEO';
export const SET_VIDEO_STREAM = 'SET_VIDEO_STREAM';
export const REMOVE_VIDEO_STREAM = 'REMOVE_VIDEO_STREAM';
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
}

export interface ISetVideoPayload {
    video: HTMLVideoElement;
    deviceId: string;
}

interface ISetVideoAction {
    type: typeof SET_VIDEO;
    payload: ISetVideoPayload;
}

interface ISetVideoStreamAction {
    type: typeof SET_VIDEO_STREAM;
    video: IVideo;
}

interface IRemoveVideoStreamAction {
    type: typeof REMOVE_VIDEO_STREAM;
    deviceId: string;
}

interface IToggleWebcamAvailable {
    type: typeof TOGGLE_WEBCAM_AVAILABLE;
}

export type VideoActionTypes =
    | ISetVideoAction
    | ISetVideoStreamAction
    | IRemoveVideoStreamAction
    | IToggleWebcamAvailable;
