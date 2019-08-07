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
import { getImageData, getVideoDimensions } from './videoSelectors';

export function getDetections(state: IRootStore): Detections {
    return state.detectionStore.detections;
}

export const getSelectionsCombiner = (
    detections: Detections,
    previousTargets: ICoords[],
    previousColours: IColor[],
    imageData: ImageData,
) =>
    previousTargets.length > 0
        ? select(
              detections,
              closerToPrediction(
                  getPredictedTarget(previousTargets),
                  imageData,
                  getPredictedColor(previousColours),
              ),
          )
        : select(detections, first);

export const getSelections = createSelector(
    [getDetections, getPreviousTargets, getPreviousColors, getImageData],
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

export const getColorCombiner = (
    selection: IDetection | undefined,
    imageData: ImageData,
): IColor =>
    selection
        ? calculateColorMatch(selection.info.keypoints, imageData)
        : { r: 0, g: 0, b: 0 };
export const getColor = createSelector(
    [getSelections, getImageData],
    getColorCombiner,
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
