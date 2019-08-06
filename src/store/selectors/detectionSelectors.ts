import { createSelector } from 'reselect';
import { centerPoint } from '../../AppConstants';
import { Detections, IDetection } from '../../models/objectDetection';
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
import { getImageData, getVideoDimensions } from './videoSelectors';

export function getDetections(state: IRootStore): Detections {
    return state.detectionStore.detections;
}

export const getSelectionsCombiner = (
    detections: Detections,
    previousTargets: ICoords[],
    previousColours: IColour[],
    imageData: ImageData,
) =>
    previousTargets.length > 0
        ? select(
              detections,
              closerToPrediction(
                  getPredictedTarget(previousTargets),
                  imageData,
                  getPredictedColour(previousColours),
              ),
          )
        : select(detections, first);

export const getSelections = createSelector(
    [getDetections, getPreviousTargets, getPreviousColours, getImageData],
    getSelectionsCombiner,
);

export const getTargetsCombiner = (
    selections: IDetection | undefined,
    videoDimensions: { width: number; height: number } | undefined,
): ICoords =>
    !selections || !videoDimensions
        ? centerPoint
        : calculateNormalisedPos(
              selections!.bbox,
              videoDimensions!.width,
              videoDimensions!.height,
          );
export const getTargets = createSelector(
    [getSelections, getVideoDimensions],
    getTargetsCombiner,
);

export const getColourCombiner = (
    selection: IDetection | undefined,
    imageData: ImageData,
): IColour =>
    selection
        ? calculateColourMatch(selection.info.keypoints, imageData)
        : { r: 0, g: 0, b: 0 };
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

export function getOpenCoefficient(state: IRootStore): number {
    return state.detectionStore.eyesOpenCoefficient;
}

export function getAnimations(state: IRootStore): Animation {
    return state.detectionStore.animation;
}
