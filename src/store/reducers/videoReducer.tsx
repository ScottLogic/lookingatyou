import { VideoActionTypes, IVideoState, SET_VIDEO, SET_DIMENSIONS, IDimensions, IVideo, SET_VIDEO_STREAMS } from "../actions/video/types";


export const initialState: IVideoState = {
  videos: [],
}


const videoStore = (state: IVideoState = initialState, action: VideoActionTypes): IVideoState => {
  switch (action.type) {
    case SET_VIDEO_STREAMS:
      return { ...state, videos: action.videos };
    default:
      return state
  }
}

export function getVideo(state: IVideoState): (HTMLVideoElement | undefined)[] {
  return state.videos.map(item => item.video);
}


export default videoStore;
