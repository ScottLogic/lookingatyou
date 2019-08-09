import {
    IAdvancedConfig,
    IAppConfig,
    IConfigState,
} from '../actions/config/types';
import { IRootStore } from '../reducers/rootReducer';

export function getConfig(state: IRootStore): IConfigState {
    return { ...state.configStore };
}

export function getAppConfig(state: IRootStore): IAppConfig {
    return state.configStore.appConfig;
}

export function getAdvancedConfig(state: IRootStore): IAdvancedConfig {
    return state.configStore.advancedConfig;
}

export function getFPS(state: IRootStore): number {
    return state.configStore.appConfig.fps;
}
