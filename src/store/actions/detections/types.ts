import { PoseNet } from '@tensorflow-models/posenet';
import { Detections } from '../../../models/objectDetection';
import { IColour, ICoords, IHistory } from '../../../utils/types';

export const SET_MODEL = 'SET_MODEL';
export const SET_INTERVAL = 'SET_INTERVAL';
export const SET_IDLE_TARGET = 'SET_IDLE_TARGET';
export const SET_DETECTIONS = 'SET_DETECTIONS';
export const SET_OPEN = 'SET_OPEN';
export const SET_ANIMATION = 'SET_ANIMATION';

export interface IDetectionState {
    model: PoseNet | null;
    detectionInterval: number;
    eyesOpenCoefficient: number;
    detections: Detections;
    history: IHistory[];
    idleTarget: ICoords;
    animation: any[];
}

export interface ISetModelAction {
    type: 'SET_MODEL';
    payload: PoseNet | null;
}

export interface ISetIntervalAction {
    type: 'SET_INTERVAL';
    payload: number;
}

export interface ISetIdleTargetAction {
    type: 'SET_IDLE_TARGET';
    payload: ICoords;
}

export interface ISetDetectionsActionPayload {
    detections: Detections;
    previousTarget: ICoords;
    previousColour: IColour;
}

export interface ISetDetectionsAction {
    type: 'SET_DETECTIONS';
    payload: ISetDetectionsActionPayload;
}

export interface ISetOpenAction {
    type: 'SET_OPEN';
    payload: number;
}

export interface ISetAnimationAction {
    type: typeof SET_ANIMATION;
    payload: any[];
}

export type DetectionActionType =
    | ISetModelAction
    | ISetIntervalAction
    | ISetIdleTargetAction
    | ISetDetectionsAction
    | ISetOpenAction
    | ISetAnimationAction;
