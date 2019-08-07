import { createSelector } from 'reselect';
import { centerPoint } from '../../AppConstants';
import { Detections, IDetection } from '../../models/objectDetection';
import select, {
    calculateColorMatch,
    closerToPrediction,
    first,
    getPredictedColor,
    getPredictedTarget,
} from '../../utils/objectSelection/select';
import { calculateNormalisedPos } from '../../utils/objectTracking/calculateFocus';
import { Animation } from '../../utils/pose/animations';
import { IColor, ICoords } from '../../utils/types';
import { IRootStore } from '../reducers/rootReducer';
import { getImageData, getVideo } from './videoSelectors';

export function getDetections(state: IRootStore): Detections {
    return state.detectionStore.detections;
}

export const getSelectionsCombiner = (
    detections: IDetection[],
    previousTargets: ICoords[],
    previousColours: IColor[],
    imageData: ImageData,
) => {
    if (previousTargets.length > 0) {
        const predictedTarget = getPredictedTarget(previousTargets);
        const predictedColour = getPredictedColor(previousColours);

        return select(
            detections,
            closerToPrediction(predictedTarget, imageData, predictedColour),
        );
    } else {
        return select(detections, first);
    }
};
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

export const getTargetsCombiner = (
    selections: IDetection | undefined,
    video: HTMLVideoElement | undefined,
    idleTargets: ICoords,
): ICoords => {
    const normalisedTarget =
        selections === undefined || !video
            ? undefined
            : calculateNormalisedPos(
                  selections.bbox,
                  video!.width,
                  video!.height,
              );
    return normalisedTarget ? normalisedTarget : idleTargets;
};
export const getTargets = createSelector(
    [getSelections, getVideo],
    (selections, video): ICoords => {
        return selections === undefined || !video
            ? centerPoint
            : calculateNormalisedPos(
                  selections.bbox,
                  video!.width,
                  video!.height,
              );
    },
);

export const getColor = createSelector(
    [getSelections, getImageData],
    (selection, imageData): IColor => {
        if (selection) {
            const color = calculateColorMatch(
                selection.info.keypoints,
                imageData,
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

export function getOpenCoefficient(state: IRootStore): number {
    return state.detectionStore.eyesOpenCoefficient;
}

export function getAnimations(state: IRootStore): Animation {
    return state.detectionStore.animation;
}
