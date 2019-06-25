import { combineReducers } from 'redux';
import { IVideoState } from '../actions/video/types';
import videoStore from './videoReducer';

export default combineReducers({
    videoStore,
});

export interface IRootStore {
    videoStore: IVideoState;
}
