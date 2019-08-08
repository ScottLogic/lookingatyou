import {
    architectures,
    inputResolutions,
    multipliers,
    outputStrides,
} from '../../../models/objectDetection';

export enum ConfigSetAction {
    APP = 'SET_APP_CONFIG',
    MODEL = 'SET_MODEL_CONFIG',
    DETECTION = 'SET_DETECTION_CONFIG',
}

export interface IConfigState extends IAppConfig {
    modelConfig: IModelConfig;
    detectionConfig: IDetectionConfig;
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
    toggleDebug: boolean;
    toggleAdvanced: boolean;
    irisColor: string;
    toggleReflection: boolean;
    reflectionOpacity: number;
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

export type ConfigAction =
    | ISetAppConfigAction
    | ISetModelConfigAction
    | ISetDetectionConfigAction;
