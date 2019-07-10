import { eyelidPosition, pupilSizes, sleepDelay } from '../../AppConstants';
import {
    setBright,
    setDetected,
    setDilation,
    setLeft,
    setOpen,
    setSquinting,
    setTarget,
} from '../../store/actions/detections/actions';
import { getVideos } from '../../store/selectors/videoSelectors';
import { AppStore } from '../../store/store';
import { analyseLight, checkLight, naturalMovement } from '../eye/EyeUtils';

let sleepTimeout: NodeJS.Timeout | null;

export function checkSelection(store: AppStore) {
    const state = store.getState();

    const selection = state.detectionStore.detections.left.find(detection => {
        return detection.info.type === 'person';
    });

    if (state.detectionStore.isSquinting && Math.random() < 0.1) {
        store.dispatch(setOpen(eyelidPosition.OPEN));
        store.dispatch(setSquinting(false));
    }

    if (selection) {
        wake(store);
        if (state.detectionStore.isSquinting) {
            store.dispatch(setOpen(eyelidPosition.OPEN));
        }
        isNewTarget(store);
    } else {
        sleep(store);
        hasTargetLeft(store);

        if (Math.abs(state.detectionStore.target.left.x) > 1) {
            const stopEyeLeaving = {
                left: {
                    x: 0,
                    y: state.detectionStore.target.left.y,
                },
                right: null,
            };
            store.dispatch(setTarget(stopEyeLeaving));
        }

        const { newX, left } = naturalMovement(
            state.detectionStore.target.left.x,
            state.detectionStore.left,
        );

        const newTarget = { left: { x: newX, y: 0 }, right: null };

        store.dispatch(setTarget(newTarget));
        store.dispatch(setLeft(left));
    }
}

export function calculateBrightness(store: AppStore) {
    const state = store.getState();

    if (getVideos(state)) {
        const { tooBright, scaledPupilSize } = checkLight(
            window.document,
            state.detectionStore.tooBright,
            getVideos(state)[0] as HTMLVideoElement,
            analyseLight,
        );

        if (tooBright) {
            store.dispatch(setBright(true));
            store.dispatch(setOpen(eyelidPosition.CLOSED));
        } else if (state.detectionStore.tooBright) {
            store.dispatch(setBright(false));
            store.dispatch(setOpen(eyelidPosition.OPEN));
        }

        store.dispatch(setDilation(scaledPupilSize));
    }
}

function isNewTarget(store: AppStore) {
    if (!store.getState().detectionStore.personDetected) {
        store.dispatch(setDetected(true));
        store.dispatch(setDilation(pupilSizes.dilated));
    }
}

function hasTargetLeft(store: AppStore) {
    if (store.getState().detectionStore.personDetected) {
        store.dispatch(setDetected(false));
        store.dispatch(setSquinting(true));
        store.dispatch(setDilation(pupilSizes.constricted));

        const target = { left: { x: 0, y: 0 }, right: null };
        store.dispatch(setTarget(target));
        store.dispatch(setOpen(eyelidPosition.SQUINT));
    }
}

function wake(store: AppStore) {
    if (sleepTimeout !== null) {
        clearTimeout(sleepTimeout);
        sleepTimeout = null;
        store.dispatch(setOpen(eyelidPosition.OPEN));
    }
}

function sleep(store: AppStore) {
    if (sleepTimeout === null) {
        sleepTimeout = setTimeout(() => {
            store.dispatch(setOpen(eyelidPosition.CLOSED));
        }, sleepDelay);
    }
}
