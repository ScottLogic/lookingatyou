import { SET_VIDEO, VideoActionTypes, SET_VIDEO_STREAMS, IVideo, ISetVideoPayload } from "./types";

export function setVideoAction(payload: ISetVideoPayload): VideoActionTypes {
  return {
    type: SET_VIDEO,
    payload: payload,
  }
}

export function setVideoStreamsAction(videos: IVideo[]) :VideoActionTypes {
  return {
    type: SET_VIDEO_STREAMS,
    videos: videos,
  }
}
