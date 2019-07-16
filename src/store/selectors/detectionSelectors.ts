import { createSelector } from 'reselect';
import { IDetections } from '../../models/objectDetection';
import select, {
    closerVerticallyTo,
    largerThan,
    leftOf,
} from '../../utils/objectSelection/select';
import { calculateNormalisedPos } from '../../utils/objectTracking/calculateFocus';
import { ITargets } from '../../utils/types';
import { IRootStore } from '../reducers/rootReducer';
import { getVideos } from './videoSelectors';

export function getDetections(state: IRootStore): IDetections {
    return state.detectionStore.detections;
}

export const getSelections = createSelector(
    [getDetections],
    detections => {
        const left = select(detections.left, largerThan);
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
    [getSelections, getVideos],
    (selections, videos): ITargets => {
        let left;
        let right;
        left =
            selections.left === undefined || !videos[0]
                ? undefined
                : calculateNormalisedPos(
                      selections.left,
                      videos[0]!.width,
                      videos[0]!.height,
                  );
        right =
            selections.right === undefined || !videos[1]
                ? left
                : calculateNormalisedPos(
                      selections.right,
                      videos[1]!.width,
                      videos[1]!.height,
                  );
        if (left !== undefined && right !== undefined) {
            const y = (left.y + right.y) / 2;
            left.y = right.y = y;
        }
        return {
            left,
            right,
        };
    },
);

export function getOpenCoefficient(state: IRootStore): number {
    return state.detectionStore.eyesOpenCoefficient;
}
