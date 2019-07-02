import { IDetection } from '../../../models/objectDetection';
import { ICoords } from '../../../utils/types';
import {
    ISetDetectionsAction,
    ISetLoadedAction,
    ISetTargetAction,
    SET_DETECTIONS,
    SET_MODEL_LOADED,
    SET_TARGET,
} from './types';

export function setModelLoaded(hasLoaded: boolean): ISetLoadedAction {
    return {
        type: SET_MODEL_LOADED,
        payload: hasLoaded,
    };
}

export function setTarget(target: ICoords): ISetTargetAction {
    return {
        type: SET_TARGET,
        payload: target,
    };
}

export function setDetections(detections: IDetection[]): ISetDetectionsAction {
    return {
        type: SET_DETECTIONS,
        payload: detections,
    };
}
