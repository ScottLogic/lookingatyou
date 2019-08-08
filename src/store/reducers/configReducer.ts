import {
    ConfigAction,
    ConfigSetAction,
    IAdvancedConfig,
    IAppConfig,
    IConfigState,
    IDetectionConfig,
    IModelConfig,
    ISetAppConfigAction,
    ISetDetectionConfigAction,
    ISetModelConfigAction,
} from '../actions/config/types';

export const initalModelConfig: IModelConfig = {
    architecture: 'MobileNetV1',
    outputStride: 16,
    inputResolution: 161,
    multiplier: 0.5,
};

export const initialDetectionConfig: IDetectionConfig = {
    flipHorizontal: false,
    maxDetections: 5,
    scoreThreshold: 0.6,
    nmsRadius: 20,
};

export const initialAppConfig: IAppConfig = {
    xSensitivity: 1,
    ySensitivity: 1,
    fps: 2,
    irisColor: '#55acee', // must be hex value, as this is passed to colour picker input
    toggleAdvanced: false,
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
    return { ...state, ...(action as ISetAppConfigAction).payload };
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
    return initialConfig;
}

export default configStore;
