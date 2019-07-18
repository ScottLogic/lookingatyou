import { combineReducers } from 'redux';
import { ConfigActionTypes, IConfigState } from '../actions/config/types';
import {
    DetectionActionType,
    IDetectionState,
} from '../actions/detections/types';
import { IVideoState, VideoActionTypes } from '../actions/video/types';
import configStore, {
    initialState as initialConfigState,
} from './configReducer';
import detectionStore, {
    initialState as initialDetectionState,
} from './detectionReducer';
import videoStore, { initialState as initialVideoState } from './videoReducer';

export default combineReducers({
    videoStore,
    configStore,
    detectionStore,
});

const rootStore = (
    state: IRootStore = {
        detectionStore: initialDetectionState,
        videoStore: initialVideoState,
        configStore: initialConfigState,
    },
    action: DetectionActionType | VideoActionTypes | ConfigActionTypes,
): IDetectionState => {
    return action.type in detectionActionMapping
        ? detectionActionMapping[action.type](state, action)
        : state;
};

export interface IRootStore {
    videoStore: IVideoState;
    configStore: IConfigState;
    detectionStore: IDetectionState;
}
