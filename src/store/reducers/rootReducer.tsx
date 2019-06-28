import { combineReducers } from 'redux';
import { IConfigState } from '../actions/config/types';
import { IVideoState } from '../actions/video/types';
import configStore from './configReducer';
import videoStore from './videoReducer';

export default combineReducers({
    videoStore,
    configStore,
});

export interface IRootStore {
    videoStore: IVideoState;
    configStore: IConfigState;
}
