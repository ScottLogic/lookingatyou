import IUserConfig from '../../../components/configMenu/IUserConfig';
export const UPDATE_CONFIG = 'UPDATE_CONFIG';
export const RESET_CONFIG = 'RESET_CONFIG';
export interface IConfigState {
    config: IUserConfig;
}
export interface ISetConfigPayload {
    partialConfig: Partial<IUserConfig>;
}
interface IUpdateConfigAction {
    type: typeof UPDATE_CONFIG;
    payload: ISetConfigPayload;
}
interface IResetConfigAction {
    type: typeof RESET_CONFIG;
}
export type ConfigActionTypes = IUpdateConfigAction | IResetConfigAction;
