import { eyelidPosition, pupilSizes, sleepDelay } from '../../AppConstants';
import {
    SET_BRIGHT,
    SET_DILATION,
    SET_LEFT,
    SET_OPEN,
    SET_PERSON,
    SET_SQUINT,
    SET_TARGET,
} from '../../store/actions/detections/types';
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
        setOpenCoefficient(store, eyelidPosition.OPEN);
        store.dispatch({ type: SET_SQUINT, payload: false });
    }

    if (selection) {
        wake(store);
        if (state.detectionStore.isSquinting) {
            setOpenCoefficient(store, eyelidPosition.OPEN);
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
            store.dispatch({ type: SET_TARGET, payload: stopEyeLeaving });
        }

        const { newX, left } = naturalMovement(
            state.detectionStore.target.left.x,
            state.detectionStore.left,
        );

        const newTarget = { left: { x: newX, y: 0 }, right: null };

        store.dispatch({ type: SET_TARGET, payload: newTarget });
        store.dispatch({ type: SET_LEFT, payload: left });
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
            store.dispatch({ type: SET_BRIGHT, payload: true });
            store.dispatch({ type: SET_OPEN, payload: eyelidPosition.CLOSED });
        } else if (state.detectionStore.tooBright) {
            store.dispatch({ type: SET_BRIGHT, payload: false });
            store.dispatch({ type: SET_OPEN, payload: eyelidPosition.OPEN });
        }

        store.dispatch({ type: SET_DILATION, payload: scaledPupilSize });
    }
}

function isNewTarget(store: AppStore) {
    if (!store.getState().detectionStore.personDetected) {
        store.dispatch({ type: SET_PERSON, payload: true });
        store.dispatch({ type: SET_DILATION, payload: pupilSizes.dilated });
    }
}

function hasTargetLeft(store: AppStore) {
    if (store.getState().detectionStore.personDetected) {
        store.dispatch({ type: SET_PERSON, payload: false });
        store.dispatch({ type: SET_SQUINT, payload: true });
        store.dispatch({ type: SET_DILATION, payload: pupilSizes.constricted });

        const target = { left: { x: 0, y: 0 }, right: null };
        store.dispatch({ type: SET_TARGET, payload: target });
        setOpenCoefficient(store, eyelidPosition.SQUINT);
    }
}

function wake(store: AppStore) {
    if (sleepTimeout !== null) {
        clearTimeout(sleepTimeout);
        sleepTimeout = null;
        setOpenCoefficient(store, eyelidPosition.OPEN);
    }
}

function sleep(store: AppStore) {
    if (sleepTimeout === null) {
        sleepTimeout = setTimeout(() => {
            setOpenCoefficient(store, eyelidPosition.CLOSED);
        }, sleepDelay);
    }
}

function setOpenCoefficient(store: AppStore, openCoefficient: number) {
    store.dispatch({ type: SET_OPEN, payload: openCoefficient });
}
