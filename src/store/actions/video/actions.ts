import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { configureStreams } from '../../../components/webcamHandler/WebcamHandler';
import { IRootStore } from '../../reducers/rootReducer';
import { createAction, createActionPayload } from '../creators';
import {
    IVideo,
    SET_IMAGE_DATA,
    SET_VIDEO,
    SET_VIDEO_STREAMS,
    TOGGLE_WEBCAM_AVAILABLE,
} from './types';

export function setStream(mediaDevices: MediaDevices) {
    return async (
        dispatch: ThunkDispatch<IRootStore, void, Action>,
        getState: () => IRootStore,
    ) => {
        const streams = await configureStreams(mediaDevices);
        const videoStore = getState().videoStore;
        if (streams) {
            dispatch(setVideoStreamsAction(streams));
            if (!videoStore.webcamAvailable) {
                dispatch(toggleWebcamAvailable());
            }
        } else {
            if (videoStore.webcamAvailable) {
                dispatch(toggleWebcamAvailable());
            }
        }
    };
}

export const setVideoAction = createActionPayload<
    typeof SET_VIDEO,
    HTMLVideoElement
>(SET_VIDEO);

export const setVideoStreamsAction = createActionPayload<
    typeof SET_VIDEO_STREAMS,
    IVideo
>(SET_VIDEO_STREAMS);

export const toggleWebcamAvailable = createAction<
    typeof TOGGLE_WEBCAM_AVAILABLE
>(TOGGLE_WEBCAM_AVAILABLE);

export const setImageDataAction = createActionPayload<
    typeof SET_IMAGE_DATA,
    ImageData
>(SET_IMAGE_DATA);
