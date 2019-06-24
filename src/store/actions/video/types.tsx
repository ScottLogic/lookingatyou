export const SET_VIDEO = 'SET_VIDEO';
export const SET_DIMENSIONS = 'SET_DIMENSIONS';

export interface IVideoState {
  video: HTMLVideoElement | null,
  width: number,
  height: number,
}

export interface IDimensions {
  width: number,
  height: number,
}

interface ISetVideoAction {
  type: typeof SET_VIDEO,
  payload: HTMLVideoElement,
}

interface ISetDimensionsAction {
  type: typeof SET_DIMENSIONS,
  payload: IDimensions,
}

export type VideoActionTypes = ISetVideoAction | ISetDimensionsAction
