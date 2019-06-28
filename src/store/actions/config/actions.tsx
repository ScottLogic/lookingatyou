import IUserConfig from '../../../components/configMenu/IUserConfig';
import { ConfigActionTypes, ISetConfigPayload, SET_CONFIG } from './types';
export function setConfigAction(payload: ISetConfigPayload): ConfigActionTypes {
    return {
        type: SET_CONFIG,
        payload,
    };
}
