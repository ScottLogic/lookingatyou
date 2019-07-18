import { createSelector } from 'reselect';
import { IDetections } from '../../models/objectDetection';
import select, {
    closerToPrediction,
    closerVerticallyTo,
    leftOf,
    setPrediction,
} from '../../utils/objectSelection/select';
import { calculateNormalisedPos } from '../../utils/objectTracking/calculateFocus';
import { ITargets } from '../../utils/types';
import { IRootStore } from '../reducers/rootReducer';
import { getVideos } from './videoSelectors';

export function getDetections(state: IRootStore): IDetections {
    return state.detectionStore.detections;
}

export const getSelections = createSelector(
    [getDetections, getPreviousTargets, getVideos],
    (detections, previousTargets, videos) => {
        const leftCam = true;
        const prediction = setPrediction(leftCam, previousTargets);
        console.log(prediction);
        console.log(previousTargets.map(target => target.left));
        const width = videos[0] ? videos[0]!.width : 1;
        const height = videos[0] ? videos[0]!.height : 1;
        const left = select(
            detections.left,
            closerToPrediction(prediction, width, height),
        );
        const right =
            left === undefined
                ? undefined
                : select(
                      detections.right,
                      closerVerticallyTo(left[1]),
                      leftOf(left[0] + left[2] / 2),
                  );
        return {
            left,
            right,
        };
    },
);

export const getTargets = createSelector(
    [getSelections, getVideos, getIdleTargets],
    (selections, videos, idleTargets): ITargets => {
        const left =
            selections.left === undefined || !videos[0]
                ? undefined
                : calculateNormalisedPos(
                      selections.left,
                      videos[0]!.width,
                      videos[0]!.height,
                  );
        const right =
            selections.right === undefined || !videos[1]
                ? left
                : calculateNormalisedPos(
                      selections.right,
                      videos[1]!.width,
                      videos[1]!.height,
                  );
        if (left && right) {
            const y = (left.y + right.y) / 2;
            left.y = right.y = y;
            return {
                left,
                right,
            };
        } else {
            return idleTargets;
        }
    },
);

export function getPreviousTarget(state: IRootStore): ITargets {
    return state.detectionStore.history[
        state.detectionStore.history.length - 1
    ];
}

export function getPreviousTargets(state: IRootStore): ITargets[] {
    return state.detectionStore.history;
}

export function getIdleTargets(state: IRootStore): ITargets {
    return state.detectionStore.idleTarget;
}

export function getOpenCoefficient(state: IRootStore): number {
    return state.detectionStore.eyesOpenCoefficient;
}
