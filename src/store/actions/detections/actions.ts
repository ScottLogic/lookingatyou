import { IDetection } from '../../../models/objectDetection';
import { ICoords } from '../../../utils/types';
import {
    ISetBrightAction,
    ISetDetectionsAction,
    ISetDilationAction,
    ISetLeftAction,
    ISetLoadedAction,
    ISetOpenAction,
    ISetPersonAction,
    ISetSquintAction,
    ISetTargetAction,
    SET_BRIGHT,
    SET_DETECTIONS,
    SET_DILATION,
    SET_LEFT,
    SET_MODEL_LOADED,
    SET_OPEN,
    SET_PERSON,
    SET_SQUINT,
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

export function setLeft(left: boolean): ISetLeftAction {
    return {
        type: SET_LEFT,
        payload: left,
    };
}

export function setDilation(dilation: number): ISetDilationAction {
    return {
        type: SET_DILATION,
        payload: dilation,
    };
}

export function setOpen(openCoefficient: number): ISetOpenAction {
    return {
        type: SET_OPEN,
        payload: openCoefficient,
    };
}

export function setDetected(person: boolean): ISetPersonAction {
    return {
        type: SET_PERSON,
        payload: person,
    };
}

export function setSquinting(isSquinting: boolean): ISetSquintAction {
    return {
        type: SET_SQUINT,
        payload: isSquinting,
    };
}

export function setBright(isBright: boolean): ISetBrightAction {
    return {
        type: SET_BRIGHT,
        payload: isBright,
    };
}
