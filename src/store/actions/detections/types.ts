import { PoseNet } from '@tensorflow-models/posenet';
import { Detections, IDetection } from '../../../models/objectDetection';
import { Animation } from '../../../utils/pose/animations';
import { IColour, ICoords, IHistory } from '../../../utils/types';

export const SET_MODEL = 'SET_MODEL';
export const SET_INTERVAL = 'SET_INTERVAL';
export const SET_IDLE_TARGET = 'SET_IDLE_TARGET';
export const SET_DETECTIONS = 'SET_DETECTIONS';
export const SET_OPEN = 'SET_OPEN';
export const SET_ANIMATION = 'SET_ANIMATION';
export const SWAP_SELECTION = 'SWAP_SELECTION';

export interface IDetectionState {
    model: PoseNet | null;
    detectionInterval: number;
    eyesOpenCoefficient: number;
    detections: Detections;
    history: IHistory[];
    idleTarget: ICoords;
    animation: Animation;
    nextSelectionSwapTime: number;
}

export interface ISetModelAction {
    readonly type: 'SET_MODEL';
    readonly payload: PoseNet | null;
}

export interface ISetIntervalAction {
    readonly type: 'SET_INTERVAL';
    readonly payload: number;
}

export interface ISetDetectionsActionPayload {
    readonly detections: Detections;
    readonly previousTarget: ICoords;
    readonly previousColour: IColour;
}

export interface ISetDetectionsAction {
    readonly type: 'SET_DETECTIONS';
    readonly payload: ISetDetectionsActionPayload;
}

export interface ISetOpenAction {
    readonly type: 'SET_OPEN';
    readonly payload: number;
}

export interface ISetAnimationAction {
    readonly type: typeof SET_ANIMATION;
    readonly payload: Animation;
}

export interface ISwapSelectionActionPayload {
    readonly selection: IDetection | undefined;
    readonly nextSelectionSwapTime: number;
}

export interface ISwapSelectionAction {
    readonly type: 'SWAP_SELECTION';
    readonly payload: ISwapSelectionActionPayload;
}

export type DetectionActionType =
    | ISetModelAction
    | ISetIntervalAction
    | ISetDetectionsAction
    | ISetOpenAction
    | ISetAnimationAction
    | ISwapSelectionAction;
