import { SET_VIDEO, VideoActionTypes, IDimensions, SET_DIMENSIONS } from "./types";

export function setVideoAction(payload: HTMLVideoElement): VideoActionTypes {
  return {
    type: SET_VIDEO,
    payload: payload,
  }
}

export function setVideoDimensions(payload: IDimensions): VideoActionTypes {
  return {
    type: SET_DIMENSIONS,
    payload: payload,
  }
}
