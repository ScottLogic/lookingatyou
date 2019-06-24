import { combineReducers } from 'redux';
import videoStore from './videoReducer';
import { IVideoState } from '../actions/video/types';


export default combineReducers({
  videoStore
});


export interface IRootStore {
  videoStore: IVideoState,
}
