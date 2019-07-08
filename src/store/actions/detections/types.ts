import {
    IDetections,
    IObjectDetector,
    ISelections,
} from '../../../models/objectDetection';
import { ITargets } from '../../../utils/types';

export const SET_MODEL = 'SET_MODEL';
export const SET_TARGET = 'SET_TARGET';
export const SET_DETECTIONS = 'SET_DETECTIONS';
export const SET_BRIGHT = 'SET_BRIGHT';
export const SET_DILATION = 'SET_DILATION';
export const SET_PERSON = 'SET_PERSON';
export const SET_LEFT = 'SET_LEFT';
export const SET_OPEN = 'SET_OPEN';
export const SET_SQUINT = 'SET_SQUINT';
export const SET_SELECTIONS = 'SET_SELECTIONS';

export interface IDetectionState {
    model: IObjectDetector | null;
    tooBright: boolean;
    left: boolean;
    dilationCoefficient: number;
    eyesOpenCoefficient: number;
    personDetected: boolean;
    isSquinting: boolean;
    target: ITargets;
    detections: IDetections;
    selections: ISelections;
}

export interface ISetModelAction {
    type: 'SET_MODEL';
    payload: IObjectDetector;
}

export interface ISetTargetAction {
    type: 'SET_TARGET';
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

export interface ISetSelectionsAction {
    type: 'SET_SELECTIONS';
    payload: ISelections;
}

export type DetectionActionType =
    | ISetModelAction
    | ISetTargetAction
    | ISetDetectionsAction
    | ISetBrightAction
    | ISetDilationAction
    | ISetLeftAction
    | ISetOpenAction
    | ISetPersonAction
    | ISetSquintAction
    | ISetSelectionsAction;
