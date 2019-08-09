import {
    architectures,
    inputResolutions,
    multipliers,
    outputStrides,
} from '../../../models/objectDetection';

export enum ConfigSetAction {
    APP = 'SET_APP_CONFIG',
    ADVANCED = 'SET_ADVANCED',
    MODEL = 'SET_MODEL_CONFIG',
    DETECTION = 'SET_DETECTION_CONFIG',
    RESET = 'RESET_CONFIG',
}

export interface IConfigState {
    advancedConfig: IAdvancedConfig;
    appConfig: IAppConfig;
}

export type PartialConfig =
    | Partial<IAppConfig>
    | Partial<IModelStringConfig>
    | Partial<IModelConfig>
    | Partial<IDetectionConfig>;

export interface IAppConfig {
    xSensitivity: number;
    ySensitivity: number;
    fps: number;
    toggleAdvanced: boolean;
    irisColor: string;
    showHelp: boolean;
}

export interface IAdvancedConfig {
    toggleReflection: boolean;
    reflectionOpacity: number;
    toggleDebug: boolean;
    modelConfig: IModelConfig;
    detectionConfig: IDetectionConfig;
}

export interface IModelConfig {
    architecture: architectures;
    outputStride: outputStrides;
    multiplier: multipliers;
    inputResolution: inputResolutions;
}

export interface IModelStringConfig {
    architecture: architectures;
    outputStride: string;
    multiplier: string;
    inputResolution: string;
}

export interface IDetectionConfig {
    flipHorizontal: boolean;
    maxDetections: number;
    scoreThreshold: number;
    nmsRadius: number;
}

export interface ISetAppConfigAction {
    readonly type: ConfigSetAction.APP;
    readonly payload: Partial<IAppConfig>;
}

export interface ISetModelConfigAction {
    readonly type: ConfigSetAction.MODEL;
    readonly payload: Partial<IModelConfig>;
}

export interface ISetDetectionConfigAction {
    readonly type: ConfigSetAction.DETECTION;
    readonly payload: Partial<IDetectionConfig>;
}

export interface ISetAdvancedConfigAction {
    readonly type: ConfigSetAction.ADVANCED;
    readonly payload: Partial<IAdvancedConfig>;
}

export interface IResetConfigAction {
    readonly type: ConfigSetAction.RESET;
}

export type ConfigAction =
    | ISetAppConfigAction
    | ISetAdvancedConfigAction
    | ISetModelConfigAction
    | ISetDetectionConfigAction
    | IResetConfigAction;
