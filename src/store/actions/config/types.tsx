import IUserConfig from '../../../components/configMenu/IUserConfig';
export const SET_CONFIG = 'SET_CONFIG';
export interface IConfigState {
    config: IUserConfig;
}
export interface ISetConfigPayload {
    partialConfig: Partial<IUserConfig>;
}
interface ISetConfigAction {
    type: typeof SET_CONFIG;
    payload: ISetConfigPayload;
}
export type ConfigActionTypes = ISetConfigAction;
