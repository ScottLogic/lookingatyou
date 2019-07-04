import { IDetections } from '../../../models/objectDetection';
import { ITargets } from '../../../utils/types';

export const SET_MODEL_LOADED = 'SET_MODEL_LOADED';
export const SET_TARGETS = 'SET_TARGETS';
export const SET_DETECTIONS = 'SET_DETECTIONS';
export const SET_BRIGHT = 'SET_BRIGHT';
export const SET_DILATION = 'SET_DILATION';
export const SET_PERSON = 'SET_PERSON';
export const SET_LEFT = 'SET_LEFT';
export const SET_OPEN = 'SET_OPEN';
export const SET_SQUINT = 'SET_SQUINT';

export interface IDetectionState {
    isModelLoaded: boolean;
    tooBright: boolean;
    left: boolean;
    dilationCoefficient: number;
    eyesOpenCoefficient: number;
    personDetected: boolean;
    isSquinting: boolean;
    target: ITargets;
    detections: IDetections;
}

export interface ISetLoadedAction {
    type: 'SET_MODEL_LOADED';
    payload: boolean;
}

export interface ISetTargetAction {
    type: 'SET_TARGETS';
    payload: ITargets;
}

export interface ISetDetectionsAction {
    type: 'SET_DETECTIONS';
    payload: IDetections;
}

export interface ISetBrightAction {
    type: 'SET_BRIGHT';
    payload: boolean;
}

export interface ISetLeftAction {
    type: 'SET_LEFT';
    payload: boolean;
}

export interface ISetDilationAction {
    type: 'SET_DILATION';
    payload: number;
}

export interface ISetOpenAction {
    type: 'SET_OPEN';
    payload: number;
}

export interface ISetPersonAction {
    type: 'SET_PERSON';
    payload: boolean;
}

export interface ISetSquintAction {
    type: 'SET_SQUINT';
    payload: boolean;
}

export type DetectionActionType =
    | ISetLoadedAction
    | ISetTargetAction
    | ISetDetectionsAction
    | ISetBrightAction
    | ISetDilationAction
    | ISetLeftAction
    | ISetOpenAction
    | ISetPersonAction
    | ISetSquintAction;
