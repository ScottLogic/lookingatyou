import {
    ConfigActionTypes,
    ISetConfigPayload,
    RESET_CONFIG,
    UPDATE_CONFIG,
} from './types';
export function updateConfigAction(
    payload: ISetConfigPayload,
): ConfigActionTypes {
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
