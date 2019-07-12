import { IDetections, ISelections } from '../../../models/objectDetection';
import { ITargets } from '../../../utils/types';
import {
    ISetDetectionsAction,
    ISetLoadedAction,
    ISetOpenAction,
    ISetSelectionsAction,
    ISetTargetAction,
    SET_DETECTIONS,
    SET_MODEL_LOADED,
    SET_OPEN,
    SET_SELECTIONS,
    SET_TARGET,
} from './types';

export function setModelLoaded(hasLoaded: boolean): ISetLoadedAction {
    return {
        type: SET_MODEL_LOADED,
        payload: hasLoaded,
    };
}

export function setTarget(target: ITargets): ISetTargetAction {
    return {
        type: SET_TARGET,
        payload: target,
    };
}

export function setDetections(detections: IDetections): ISetDetectionsAction {
    return {
        type: SET_DETECTIONS,
        payload: detections,
    };
}

export function setSelections(selections: ISelections): ISetSelectionsAction {
    return {
        type: SET_SELECTIONS,
        payload: selections,
    };
}

export function setOpen(openCoefficient: number): ISetOpenAction {
    return {
        type: SET_OPEN,
        payload: openCoefficient,
    };
}
