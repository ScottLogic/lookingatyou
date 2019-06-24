import { SET_VIDEO, VideoActionTypes, IDimensions, SET_DIMENSIONS, IVideoState, SET_VIDEO_STREAMS, IVideo } from "./types";

export function setVideoAction(video: HTMLVideoElement): VideoActionTypes {
  return {
    type: SET_VIDEO,
    video: video,
  }
}

export function setVideoDimensions(dimensions: IDimensions): VideoActionTypes {
  return {
    type: SET_DIMENSIONS,
    dimensions: dimensions,
  }
}

export function setVideoStreamsAction(videos: IVideo[]) :VideoActionTypes {
  return {
    type: SET_VIDEO_STREAMS,
    videos: videos,
  }
}
