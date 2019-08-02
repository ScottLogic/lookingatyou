import { createSelector } from 'reselect';
import { Detections, IDetection } from '../../models/objectDetection';
import select, {
    calculateColourMatch,
    closerToPrediction,
    first,
    getPredictedColour,
    getPredictedTarget,
} from '../../utils/objectSelection/select';
import { calculateNormalisedPos } from '../../utils/objectTracking/calculateFocus';
import { IColour, ICoords } from '../../utils/types';
import { IRootStore } from '../reducers/rootReducer';
import { getImageData, getVideo } from './videoSelectors';

export function getDetections(state: IRootStore): Detections {
    return state.detectionStore.detections;
}

export const getSelectionCombiner = (
    detections: IDetection[],
    previousTargets: ICoords[],
    previousColours: IColour[],
    imageData: ImageData,
) => {
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
};
export const getSelections = createSelector(
    [getDetections, getPreviousTargets, getPreviousColours, getImageData],
    getSelectionCombiner,
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
    [getSelections, getVideo, getIdleTargets],
    getTargetsCombiner,
);

export const getColourCombiner = (
    selection: IDetection | undefined,
    imageData: ImageData,
): IColour => {
    if (selection) {
        const colour = calculateColourMatch(
            selection.info.keypoints,
            imageData,
        );
        return colour;
    }
    return { r: 0, g: 0, b: 0 };
};
export const getColour = createSelector(
    [getSelections, getImageData],
    getColourCombiner,
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

export function getIdleTargets(state: IRootStore): ICoords {
    return state.detectionStore.idleTarget;
}

export function getOpenCoefficient(state: IRootStore): number {
    return state.detectionStore.eyesOpenCoefficient;
}
