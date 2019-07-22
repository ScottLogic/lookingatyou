import { createSelector } from 'reselect';
import { Detections } from '../../models/objectDetection';
import select, {
    closerToPrediction,
    setPrediction,
} from '../../utils/objectSelection/select';
import { calculateNormalisedPos } from '../../utils/objectTracking/calculateFocus';
import { ICoords } from '../../utils/types';
import { IRootStore } from '../reducers/rootReducer';
import { getVideos } from './videoSelectors';

export function getDetections(state: IRootStore): Detections {
    return state.detectionStore.detections;
}

export const getSelections = createSelector(
    [getDetections, getPreviousTargets, getVideos],
    (detections, previousTargets, videos) => {
        const prediction = setPrediction(previousTargets);
        const width = videos[0] ? videos[0]!.width : 1;
        const height = videos[0] ? videos[0]!.height : 1;
        const selection = select(
            detections,
            closerToPrediction(prediction, width, height),
        );
        return selection;
    },
);

function isPose(detections: any, left: any) {
    console.log('detections', detections);
    console.log('left', left);
    return false;
}

function doAction() {}

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
