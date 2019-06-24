export const SET_VIDEO = 'SET_VIDEO';
export const SET_VIDEO_STREAMS = 'SET_VIDEO_STREAMS';
export const SET_DIMENSIONS = 'SET_DIMENSIONS';

export interface IVideo {
  deviceId: string,
  video?: HTMLVideoElement | undefined,
  width: number,
  height: number,
  stream: MediaStream | undefined,
}

export interface IVideoState {
  videos: IVideo[],
}

export interface IDimensions {
  width: number,
  height: number,
}

interface ISetVideoAction {
  type: typeof SET_VIDEO,
  video: HTMLVideoElement,
}

interface ISetDimensionsAction {
  type: typeof SET_DIMENSIONS,
  dimensions: IDimensions,
}

interface ISetVideoStreamsAction {
  type: typeof SET_VIDEO_STREAMS,
  videos: IVideo[],
}

export type VideoActionTypes = ISetVideoAction | ISetDimensionsAction | ISetVideoStreamsAction;
