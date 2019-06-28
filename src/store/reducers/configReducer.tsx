import { colours } from '../../AppConstants';
import {
    ConfigActionTypes,
    IConfigState,
    SET_CONFIG,
} from '../actions/config/types';

export const initialState: IConfigState = {
    config: {
        xSensitivity: 1,
        ySensitivity: 1,
        fps: 5,
        swapEyes: false,
        toggleDebug: false,
        irisColor: colours.irisColor,
    },
};

const configStore = (
    state: IConfigState = initialState,
    action: ConfigActionTypes,
): IConfigState => {
    switch (action.type) {
        case SET_CONFIG:
            return {
                ...state,
                ...(state.config = {
                    ...state.config,
                    ...action.payload.partialConfig,
                }),
            };
        default:
            return state;
    }
};

export default configStore;
