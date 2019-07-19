import {
    ConfigAction,
    ConfigSetAction,
    IConfigState,
    IDetectionConfig,
    IModelConfig,
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

export const initialState: IConfigState = {
    xSensitivity: 1,
    ySensitivity: 1,
    fps: 2,
    toggleDebug: false,
    irisColor: '#55acee', // must be hex value, as this is passed to colour picker input
    modelConfig: initalModelConfig,
    detectionConfig: initialDetectionConfig,
    toggleReflection: true,
    reflectionOpacity: 0.2,
};

const configActionMapping = {
    [ConfigSetAction.APP]: setAppConfig,
    [ConfigSetAction.MODEL]: setModelConfig,
    [ConfigSetAction.DETECTION]: setDetectionConfig,
};

const configStore = (
    state: IConfigState = initialState,
    action: ConfigAction,
): IConfigState => {
    return configActionMapping.hasOwnProperty(action.type)
        ? configActionMapping[action.type](state, action)
        : state;
};

function setAppConfig(state: IConfigState, action: ConfigAction): IConfigState {
    return { ...state, ...action.partialConfig };
}

function setModelConfig(
    state: IConfigState,
    action: ConfigAction,
): IConfigState {
    return {
        ...state,
        modelConfig: { ...state.modelConfig, ...action.partialConfig },
    };
}

function setDetectionConfig(
    state: IConfigState,
    action: ConfigAction,
): IConfigState {
    return {
        ...state,
        detectionConfig: { ...state.detectionConfig, ...action.partialConfig },
    };
}

export default configStore;
