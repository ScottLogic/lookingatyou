import { VideoActionTypes, IVideoState, SET_VIDEO, SET_DIMENSIONS, IDimensions } from "../actions/video/types";


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


export function getVideo(state: IVideoState): HTMLVideoElement | null {
   return state.video;
 }

 export function getDimensions(state: IVideoState): IDimensions {
   return {
     width: state.width,
     height: state.height,
   }
 }
