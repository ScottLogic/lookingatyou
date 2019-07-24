import {
    ConfigActionTypes,
    IConfigState,
    RESET_CONFIG,
    UPDATE_CONFIG,
} from '../actions/config/types';

export const initialState: IConfigState = {
    config: {
        xSensitivity: 1,
        ySensitivity: 1,
        fps: 2,
        toggleReflection: true,
        toggleDebug: false,
        irisColor: '#55acee', // must be hex value, as this is passed to colour picker input
    },
};

const configStore = (
    state: IConfigState = initialState,
    action: ConfigActionTypes,
): IConfigState => {
    switch (action.type) {
        case UPDATE_CONFIG:
            return {
                ...state,
                config: {
                    ...state.config,
                    ...action.payload.partialConfig,
                },
            };
        case RESET_CONFIG:
            return initialState;
        default:
            return state;
    }
};

export default configStore;
