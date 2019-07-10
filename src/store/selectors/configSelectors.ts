import IUserConfig from '../../components/configMenu/IUserConfig';
import { IRootStore } from '../reducers/rootReducer';
export function getConfig(state: IRootStore): IUserConfig {
    return { ...state.configStore.config };
}

export function getFPS(state: IRootStore): number {
    return state.configStore.config.fps;
}
