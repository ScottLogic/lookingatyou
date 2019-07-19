import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { IRootStore } from '../../reducers/rootReducer';
import { loadModel, restartDetection } from '../detections/actions';
import {
    ConfigActionTypes,
    ISetConfigPayload,
    RESET_CONFIG,
    UPDATE_CONFIG,
} from './types';

export function updateConfigAction(payload: ISetConfigPayload) {
    return (dispatch: ThunkDispatch<IRootStore, void, Action>) => {
        dispatch(setConfigAction(payload));
        if (payload.partialConfig.model) {
            dispatch(loadModel());
        }
        if (payload.partialConfig.fps) {
            dispatch(restartDetection());
        }
    };
}

export function setConfigAction(payload: ISetConfigPayload): ConfigActionTypes {
    return {
        type: UPDATE_CONFIG,
        payload,
    };
}

export function resetConfigAction(): ConfigActionTypes {
    return {
        type: RESET_CONFIG,
    };
}
