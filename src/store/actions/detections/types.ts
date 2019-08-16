import { PoseNet } from '@tensorflow-models/posenet';
import { Detections, IDetection } from '../../../models/objectDetection';
import { Animation } from '../../../utils/pose/animations';
import { IColor, ICoords, IHistory } from '../../../utils/types';

export const SET_MODEL = 'SET_MODEL';
export const SET_IDLE_TARGET = 'SET_IDLE_TARGET';
export const SET_DETECTIONS = 'SET_DETECTIONS';
export const SET_OPEN = 'SET_OPEN';
export const SET_ANIMATION = 'SET_ANIMATION';
export const SWAP_SELECTION = 'SWAP_SELECTION';
export const SET_INTERVAL = 'SET_INTERVAL';
export const TOGGLE_ANIMATION_COOLDOWN = 'TOGGLE_ANIMATION_COOLDOWN';

export interface IDetectionState {
    model: PoseNet | null;
    detectionInterval: number;
    eyesOpenCoefficient: number;
    detections: Detections;
    history: IHistory[];
    animation: Animation;
    animationCoolDown: boolean;
    nextSelectionSwapTime: number;
}

export interface ISetModelAction {
    readonly type: typeof SET_MODEL;
    readonly payload: PoseNet | null;
}

export interface ISetIntervalAction {
    readonly type: typeof SET_INTERVAL;
    readonly payload: number;
}

export interface ISetDetectionsActionPayload {
    readonly detections: Detections;
    readonly previousTarget: ICoords;
    readonly previousColor: IColor;
}

export interface ISetDetectionsAction {
    readonly type: typeof SET_DETECTIONS;
    readonly payload: ISetDetectionsActionPayload;
}

export interface ISetOpenAction {
    readonly type: typeof SET_OPEN;
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
    readonly type: typeof SWAP_SELECTION;
    readonly payload: ISwapSelectionActionPayload;
}

export interface IToggleAnimationCooldown {
    readonly type: typeof TOGGLE_ANIMATION_COOLDOWN;
}

export type DetectionActionType =
    | ISetModelAction
    | ISetIntervalAction
    | ISetDetectionsAction
    | ISetOpenAction
    | ISetAnimationAction
    | ISwapSelectionAction
    | IToggleAnimationCooldown;
