import { IConfigState } from '../actions/config/types';
import { IRootStore } from '../reducers/rootReducer';

export function getConfig(state: IRootStore): IConfigState {
    return { ...state.configStore };
}

export function getFPS(state: IRootStore): number {
    return state.configStore.fps;
}
