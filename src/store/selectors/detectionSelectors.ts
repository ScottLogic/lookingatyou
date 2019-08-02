import { createSelector } from 'reselect';
import { EyeSide } from '../../AppConstants';
import { Detections } from '../../models/objectDetection';
import select, {
    calculateColorMatch,
    closerToPrediction,
    first,
    getPredictedColor,
    getPredictedTarget,
} from '../../utils/objectSelection/select';
import { calculateNormalisedPos } from '../../utils/objectTracking/calculateFocus';
import { IColor, ICoords } from '../../utils/types';
import { IRootStore } from '../reducers/rootReducer';
import { getImageData, getVideos } from './videoSelectors';

export function getDetections(state: IRootStore): Detections {
    return state.detectionStore.detections;
}

export const getSelections = createSelector(
    [getDetections, getPreviousTargets, getPreviousColors, getImageData],
    (detections, previousTargets, previousColors, imageDataMap) => {
        const imageData = imageDataMap[EyeSide.LEFT];
        if (previousTargets.length > 0) {
            const predictedTarget = getPredictedTarget(previousTargets);
            const predictedColor = getPredictedColor(previousColors);

            return select(
                detections,
                closerToPrediction(predictedTarget, imageData, predictedColor),
            );
        } else {
            return select(detections, first);
        }
    },
);

export const getTargets = createSelector(
    [getSelections, getVideos, getIdleTargets],
    (selections, videos, idleTargets): ICoords => {
        const normalisedTarget =
            selections === undefined || !videos[0]
                ? undefined
                : calculateNormalisedPos(
                      selections.bbox,
                      videos[0]!.width,
                      videos[0]!.height,
                  );
        if (normalisedTarget) {
            return normalisedTarget;
        } else {
            return idleTargets;
        }
    },
);

export const getColor = createSelector(
    [getSelections, getImageData],
    (selection, imageDataMap): IColor => {
        const imageData = imageDataMap[EyeSide.LEFT];
        if (selection) {
            const color = calculateColorMatch(
                imageData,
                selection.info.keypoints,
            );
            return color;
        }
        return { r: 0, g: 0, b: 0 };
    },
);

export function getPreviousTarget(state: IRootStore): ICoords {
    return state.detectionStore.history[state.detectionStore.history.length - 1]
        .target;
}

export function getPreviousTargets(state: IRootStore): ICoords[] {
    return state.detectionStore.history.map(history => history.target);
}

export function getPreviousColor(state: IRootStore): IColor {
    return state.detectionStore.history[state.detectionStore.history.length - 1]
        .color;
}

export function getPreviousColors(state: IRootStore): IColor[] {
    return state.detectionStore.history.map(history => history.color);
}

export function getIdleTargets(state: IRootStore): ICoords {
    return state.detectionStore.idleTarget;
}

export function getOpenCoefficient(state: IRootStore): number {
    return state.detectionStore.eyesOpenCoefficient;
}
