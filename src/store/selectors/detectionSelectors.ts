import { createSelector } from 'reselect';
import { centerPoint } from '../../AppConstants';
import { Detections } from '../../models/objectDetection';
import select, {
    calculateColourMatch,
    closerToPrediction,
    first,
    getPredictedColour,
    getPredictedTarget,
} from '../../utils/objectSelection/select';
import { calculateNormalisedPos } from '../../utils/objectTracking/calculateFocus';
import { Animation } from '../../utils/pose/animations';
import { IColour, ICoords } from '../../utils/types';
import { IRootStore } from '../reducers/rootReducer';
import { getImageData, getVideo } from './videoSelectors';

export function getDetections(state: IRootStore): Detections {
    return state.detectionStore.detections;
}

export const getSelections = createSelector(
    [getDetections, getPreviousTargets, getPreviousColours, getImageData],
    (detections, previousTargets, previousColours, imageData) => {
        if (previousTargets.length > 0) {
            const predictedTarget = getPredictedTarget(previousTargets);
            const predictedColour = getPredictedColour(previousColours);

            return select(
                detections,
                closerToPrediction(predictedTarget, imageData, predictedColour),
            );
        } else {
            return select(detections, first);
        }
    },
);

export const getTargets = createSelector(
    [getSelections, getVideo],
    (selections, video): ICoords => {
        return selections && video
            ? calculateNormalisedPos(
                  selections.bbox,
                  video!.width,
                  video!.height,
              )
            : centerPoint;
    },
);

export const getColour = createSelector(
    [getSelections, getImageData],
    (selection, imageData): IColour => {
        if (selection) {
            const colour = calculateColourMatch(
                selection.info.keypoints,
                imageData,
            );
            return colour;
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

export function getPreviousColour(state: IRootStore): IColour {
    return state.detectionStore.history[state.detectionStore.history.length - 1]
        .colour;
}

export function getPreviousColours(state: IRootStore): IColour[] {
    return state.detectionStore.history.map(history => history.colour);
}

export function getOpenCoefficient(state: IRootStore): number {
    return state.detectionStore.eyesOpenCoefficient;
}

export function getAnimations(state: IRootStore): Animation {
    return state.detectionStore.animation;
}
