import { VideoActionTypes, IVideoState, SET_VIDEO, SET_DIMENSIONS } from "../actions/video/types";


const initialState: IVideoState ={
  video: null,
  width: 0,
  height: 0,
}

export default (state = initialState, action: VideoActionTypes): IVideoState => {
  switch (action.type) {
    case SET_VIDEO:
    case SET_DIMENSIONS:
      return Object.assign({}, state, action.payload);
   default:
    return state
  }
 }
