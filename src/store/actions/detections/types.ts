import { IDetections, IObjectDetector } from '../../../models/objectDetection';
import { ICoords, ITargets } from '../../../utils/types';

export const SET_MODEL = 'SET_MODEL';
export const SET_INTERVAL = 'SET_INTERVAL';
export const SET_IDLE_TARGET = 'SET_IDLE_TARGET';
export const SET_DETECTIONS = 'SET_DETECTIONS';
export const SET_OPEN = 'SET_OPEN';

export interface IDetectionState {
    model: IObjectDetector | null;
    detectionInterval: number;
    eyesOpenCoefficient: number;
    detections: IDetections;
    history: ITargets[];
    previousTarget: ITargets;
    idleTarget: ITargets;
}

export interface ISetModelAction {
    type: 'SET_MODEL';
    payload: IObjectDetector;
}

export interface ISetIntervalAction {
    type: 'SET_INTERVAL';
    payload: number;
}

export interface ISetIdleTargetAction {
    type: 'SET_IDLE_TARGET';
    payload: ICoords;
}

export interface ISetDetectionsAction {
    type: 'SET_DETECTIONS';
    payload: IDetections;
}

export interface ISetOpenAction {
    type: 'SET_OPEN';
    payload: number;
}

export type DetectionActionType =
    | ISetModelAction
    | ISetIntervalAction
    | ISetIdleTargetAction
    | ISetDetectionsAction
    | ISetOpenAction;
