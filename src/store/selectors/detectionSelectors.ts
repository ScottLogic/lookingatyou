import { createSelector } from 'reselect';
import { EyeSide } from '../../AppConstants';
import { Detections } from '../../models/objectDetection';
import select, {
    calculateColourMatch,
    closerToPrediction,
    setPrediction,
} from '../../utils/objectSelection/select';
import { calculateNormalisedPos } from '../../utils/objectTracking/calculateFocus';
import { ICoords } from '../../utils/types';
import { IRootStore } from '../reducers/rootReducer';
import { getImageData, getVideos } from './videoSelectors';

export function getDetections(state: IRootStore): Detections {
    return state.detectionStore.detections;
}

export const getSelections = createSelector(
    [getDetections, getPreviousTargets, getVideos, getImageData],
    (detections, previousTargets, videos, imageDataMap) => {
        const width = videos[0] ? videos[0]!.width : 1;
        const height = videos[0] ? videos[0]!.height : 1;
        const imageData = imageDataMap[EyeSide.LEFT];

        const prediction = setPrediction(previousTargets);

        const colour = calculateColourMatch(imageData, []);

        const selection = select(
            detections,
            closerToPrediction(prediction, width, height, imageData, colour),
        );
        return selection;
    },
);

export const getTargets = createSelector(
    [getSelections, getVideos, getIdleTargets],
    (selections, videos, idleTargets): ICoords => {
        const left =
            selections === undefined || !videos[0]
                ? undefined
                : calculateNormalisedPos(
                      selections,
                      videos[0]!.width,
                      videos[0]!.height,
                  );
        if (left) {
            return left;
        } else {
            return idleTargets;
        }
    },
);

export function getPreviousTarget(state: IRootStore): ICoords {
    return state.detectionStore.history[
        state.detectionStore.history.length - 1
    ];
}

export function getPreviousTargets(state: IRootStore): ICoords[] {
    return state.detectionStore.history;
}

export function getIdleTargets(state: IRootStore): ICoords {
    return state.detectionStore.idleTarget;
}

export function getOpenCoefficient(state: IRootStore): number {
    return state.detectionStore.eyesOpenCoefficient;
}
