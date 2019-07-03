import { IDetection } from '../../../models/objectDetection';
import { ICoords } from '../../../utils/types';

export const SET_MODEL_LOADED = 'SET_MODEL_LOADED';
export const SET_TARGET = 'SET_TARGET';
export const SET_DETECTIONS = 'SET_DETECTIONS';

export interface IDetectionState {
    isModelLoaded: boolean;
    target: ICoords;
    detections: IDetection[];
}

export interface ISetLoadedAction {
    type: 'SET_MODEL_LOADED';
    payload: boolean;
}

export interface ISetTargetAction {
    type: 'SET_TARGET';
    payload: ICoords;
}

export interface ISetDetectionsAction {
    type: 'SET_DETECTIONS';
    payload: IDetection[];
}

export type DetectionActionType =
    | ISetLoadedAction
    | ISetTargetAction
    | ISetDetectionsAction;
