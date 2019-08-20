import {
    ConfigAction,
    ConfigSetAction,
    IAdvancedConfig,
    IAppConfig,
    IConfigState,
    IDetectionConfig,
    IModelConfig,
    ISetAdvancedConfigAction,
    ISetAppConfigAction,
    ISetDetectionConfigAction,
    ISetModelConfigAction,
} from '../actions/config/types';

export const initalModelConfig: IModelConfig = {
    architecture: 'MobileNetV1',
    outputStride: 16,
    inputResolution: 289,
    multiplier: 0.75,
};

export const initialDetectionConfig: IDetectionConfig = {
    flipHorizontal: false,
    maxDetections: 4,
    scoreThreshold: 0.6,
    nmsRadius: 20,
};

export const initialAppConfig: IAppConfig = {
    xSensitivity: 0.8,
    ySensitivity: 0.6,
    fps: 5,
    irisColor: '#55acee', // must be hex value, as this is passed to colour picker input
    toggleAdvanced: false,
    showHelp: true,
};

export const initialAdvancedConfig: IAdvancedConfig = {
    toggleDebug: false,
    modelConfig: initalModelConfig,
    detectionConfig: initialDetectionConfig,
    toggleReflection: true,
    reflectionOpacity: 0.2,
};

export const initialConfig: IConfigState = {
    advancedConfig: initialAdvancedConfig,
    appConfig: initialAppConfig,
};

const configActionMapping = {
    [ConfigSetAction.APP]: setAppConfig,
    [ConfigSetAction.ADVANCED]: setAdvancedConfig,
    [ConfigSetAction.MODEL]: setModelConfig,
    [ConfigSetAction.DETECTION]: setDetectionConfig,
    [ConfigSetAction.RESET]: resetConfig,
};

const configStore = (
    state: IConfigState = initialConfig,
    action: ConfigAction,
): IConfigState => {
    return configActionMapping.hasOwnProperty(action.type)
        ? configActionMapping[action.type](state, action)
        : state;
};

function setAppConfig(state: IConfigState, action: ConfigAction): IConfigState {
    return {
        ...state,
        appConfig: {
            ...state.appConfig,
            ...(action as ISetAppConfigAction).payload,
        },
    };
}

function setAdvancedConfig(
    state: IConfigState,
    action: ConfigAction,
): IConfigState {
    return {
        ...state,
        advancedConfig: {
            ...state.advancedConfig,
            ...(action as ISetAdvancedConfigAction).payload,
        },
    };
}

function setModelConfig(
    state: IConfigState,
    action: ConfigAction,
): IConfigState {
    return {
        ...state,
        advancedConfig: {
            ...state.advancedConfig,
            modelConfig: {
                ...state.advancedConfig.modelConfig,
                ...(action as ISetModelConfigAction).payload,
            },
        },
    };
}

function setDetectionConfig(
    state: IConfigState,
    action: ConfigAction,
): IConfigState {
    return {
        ...state,
        advancedConfig: {
            ...state.advancedConfig,
            detectionConfig: {
                ...state.advancedConfig.detectionConfig,
                ...(action as ISetDetectionConfigAction).payload,
            },
        },
    };
}

function resetConfig(): IConfigState {
    return {
        ...initialConfig,
        appConfig: { ...initialConfig.appConfig, showHelp: false },
    };
}

export default configStore;
