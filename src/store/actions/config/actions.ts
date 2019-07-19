import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import {
    inputResolutions,
    multipliers,
    outputStrides,
} from '../../../models/objectDetection';
import { IRootStore } from '../../reducers/rootReducer';
import { loadModel, restartDetection } from '../detections/actions';
import {
    ConfigSetAction,
    IModelConfig,
    IModelStringConfig,
    PartialConfig,
} from './types';

export function updateConfigAction(
    type: ConfigSetAction,
    payload: PartialConfig,
    document: Document,
) {
    return (dispatch: ThunkDispatch<IRootStore, void, Action>) => {
        dispatch(setConfigAction(type, payload));
        switch (type) {
            case ConfigSetAction.APP:
                if (payload.hasOwnProperty('fps')) {
                    dispatch(restartDetection(document));
                }
                break;
            case ConfigSetAction.MODEL:
                dispatch(loadModel(document));
                break;
        }
    };
}

export function setConfigAction(type: ConfigSetAction, payload: PartialConfig) {
    let partialConfig = payload;
    if (type === ConfigSetAction.MODEL) {
        partialConfig = parseModelConfig(payload as Partial<
            IModelStringConfig
        >);
    }
    return { type, partialConfig };
}

function parseModelConfig(modelConfig: Partial<IModelStringConfig>) {
    const parsedConfig: Partial<IModelConfig> = {};
    if (modelConfig.architecture) {
        parsedConfig.architecture = modelConfig.architecture;
    }
    if (modelConfig.outputStride) {
        parsedConfig.outputStride = parseInt(
            modelConfig.outputStride,
            10,
        ) as outputStrides;
    }
    if (modelConfig.inputResolution) {
        parsedConfig.inputResolution = parseInt(
            modelConfig.inputResolution,
            10,
        ) as inputResolutions;
    }
    if (modelConfig.multiplier) {
        parsedConfig.multiplier = parseFloat(
            modelConfig.multiplier,
        ) as multipliers;
    }
    return parsedConfig;
}
