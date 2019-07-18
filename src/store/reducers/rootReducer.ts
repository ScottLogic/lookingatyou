import { combineReducers } from 'redux';
import { IConfigState } from '../actions/config/types';
import { IDetectionState } from '../actions/detections/types';
import { IVideoState } from '../actions/video/types';
import configStore from './configReducer';
import detectionStore from './detectionReducer';
import videoStore from './videoReducer';

export default combineReducers({
    videoStore,
    configStore,
    detectionStore,
});

export interface IRootStore {
    videoStore: IVideoState;
    configStore: IConfigState;
    detectionStore: IDetectionState;
}
