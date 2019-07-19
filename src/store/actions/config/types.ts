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
    type: 'SET_APP_CONFIG';
    partialConfig: Partial<IAppConfig>;
}

export interface ISetModelConfigAction {
    type: 'SET_MODEL_CONFIG';
    partialConfig: Partial<IModelConfig>;
}

export interface ISetDetectionConfigAction {
    type: 'SET_DETECTION_CONFIG';
    partialConfig: Partial<IDetectionConfig>;
}

export type ConfigAction =
    | ISetAppConfigAction
    | ISetModelConfigAction
    | ISetDetectionConfigAction;
