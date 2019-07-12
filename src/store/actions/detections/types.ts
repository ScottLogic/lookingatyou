import { IDetections, ISelections } from '../../../models/objectDetection';
import { ITargets } from '../../../utils/types';

export const SET_MODEL_LOADED = 'SET_MODEL_LOADED';
export const SET_TARGET = 'SET_TARGET';
export const SET_DETECTIONS = 'SET_DETECTIONS';
export const SET_SELECTIONS = 'SET_SELECTIONS';
export const SET_OPEN = 'SET_OPEN';

export interface IDetectionState {
    isModelLoaded: boolean;
    target: ITargets;
    detections: IDetections;
    selections: ISelections;
    openCoefficient: number;
}

export interface ISetLoadedAction {
    type: 'SET_MODEL_LOADED';
    payload: boolean;
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
    | ISetLoadedAction
    | ISetTargetAction
    | ISetDetectionsAction
    | ISetSelectionsAction
    | ISetOpenAction;
