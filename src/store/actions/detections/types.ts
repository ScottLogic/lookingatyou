import {
    IDetections,
    IObjectDetector,
    ISelections,
} from '../../../models/objectDetection';
import { ITargets } from '../../../utils/types';

export const SET_MODEL = 'SET_MODEL';
export const SET_INTERVAL = 'SET_INTERVAL';
export const SET_TARGET = 'SET_TARGET';
export const SET_DETECTIONS = 'SET_DETECTIONS';
export const SET_SELECTIONS = 'SET_SELECTIONS';
export const SET_OPEN = 'SET_OPEN';

export interface IDetectionState {
    model: IObjectDetector | null;
    detectionInterval: number;
    eyesOpenCoefficient: number;
    target: ITargets;
    detections: IDetections;
    selections: ISelections;
    history: ISelections[];
}

export interface ISetModelAction {
    type: 'SET_MODEL';
    payload: IObjectDetector;
}

export interface ISetIntervalAction {
    type: 'SET_INTERVAL';
    payload: number;
}

export interface ISetTargetAction {
    type: 'SET_TARGET';
    payload: ITargets;
}

export interface ISetDetectionsAction {
    type: 'SET_DETECTIONS';
    payload: IDetections;
}

export interface ISetSelectionsAction {
    type: 'SET_SELECTIONS';
    payload: ISelections;
}

export interface ISetOpenAction {
    type: 'SET_OPEN';
    payload: number;
}

export type DetectionActionType =
    | ISetModelAction
    | ISetIntervalAction
    | ISetTargetAction
    | ISetDetectionsAction
    | ISetSelectionsAction
    | ISetOpenAction;
