import { createSelector } from 'reselect';
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
import { getImageData, getVideo } from './videoSelectors';

export function getDetections(state: IRootStore): Detections {
    return state.detectionStore.detections;
}

export const getSelections = createSelector(
    [getDetections, getPreviousTargets, getPreviousColors, getImageData],
    (detections, previousTargets, previousColors, imageData) => {
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
    [getSelections, getVideo, getIdleTargets],
    (selections, video, idleTargets): ICoords => {
        const normalisedTarget =
            selections === undefined || !video
                ? undefined
                : calculateNormalisedPos(
                      selections.bbox,
                      video!.width,
                      video!.height,
                  );
        return normalisedTarget ? normalisedTarget : idleTargets;
    },
);

export const getColor = createSelector(
    [getSelections, getImageData],
    (selection, imageData): IColor => {
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
