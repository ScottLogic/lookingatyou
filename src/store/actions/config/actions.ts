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
    partialConfig: PartialConfig,
    document: Document,
) {
    return (dispatch: ThunkDispatch<IRootStore, void, Action>) => {
        dispatch(setConfigAction(type, partialConfig));
        switch (type) {
            case ConfigSetAction.APP:
                if (partialConfig.hasOwnProperty('fps')) {
                    dispatch(restartDetection(document));
                }
                break;
            case ConfigSetAction.MODEL:
                if (partialConfig.hasOwnProperty('architecture')) {
                    dispatch(
                        setConfigAction(ConfigSetAction.MODEL, {
                            outputStride: '16',
                            multiplier: '1',
                        }),
                    );
                }
                dispatch(loadModel(document));
                break;
        }
    };
}

export function resetConfigAction(
    type: ConfigSetAction,
): { type: ConfigSetAction } {
    return { type };
}

export function setConfigAction(
    type: ConfigSetAction,
    payload: PartialConfig,
): { type: ConfigSetAction; payload: PartialConfig } {
    if (type !== ConfigSetAction.MODEL) {
        return { type, payload };
    }

    return {
        type,
        payload: parseModelConfig(payload as Partial<IModelStringConfig>),
    };
}

function parseModelConfig(
    modelConfig: Partial<IModelStringConfig>,
): Partial<IModelConfig> {
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
