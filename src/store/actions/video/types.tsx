export const SET_VIDEO = 'SET_VIDEO';
export const SET_VIDEO_STREAMS = 'SET_VIDEO_STREAMS';
export const SET_DIMENSIONS = 'SET_DIMENSIONS';

export interface IVideo {
    deviceId: string;
    video?: HTMLVideoElement | undefined;
    width: number;
    height: number;
    stream: MediaStream | undefined;
}

export interface IVideoState {
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

interface ISetVideoStreamsAction {
    type: typeof SET_VIDEO_STREAMS;
    videos: IVideo[];
}

export type VideoActionTypes = ISetVideoAction | ISetVideoStreamsAction;
