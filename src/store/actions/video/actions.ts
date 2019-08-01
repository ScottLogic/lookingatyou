import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { configureStreams } from '../../../components/webcamHandler/WebcamHandler';
import { IRootStore } from '../../reducers/rootReducer';
import { createAction, createActionPayload } from '../creators';
import {
    ISetVideoPayload,
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
        dispatch(setVideoStreamsAction(streams));
        const videoStore = getState().videoStore;
        const streamsLength = Object.keys(streams).length;
        if (
            (videoStore.webcamAvailable && streamsLength === 0) ||
            (!videoStore.webcamAvailable && streamsLength > 0)
        ) {
            dispatch(toggleWebcamAvailable());
        }
    };
}

export const setVideoAction = createActionPayload<
    typeof SET_VIDEO,
    ISetVideoPayload
>(SET_VIDEO);

export const setVideoStreamsAction = createActionPayload<
    typeof SET_VIDEO_STREAMS,
    { [deviceId: string]: IVideo }
>(SET_VIDEO_STREAMS);

export const toggleWebcamAvailable = createAction<
    typeof TOGGLE_WEBCAM_AVAILABLE
>(TOGGLE_WEBCAM_AVAILABLE);

export const setImageDataAction = createActionPayload<
    typeof SET_IMAGE_DATA,
    { [key: string]: ImageData }
>(SET_IMAGE_DATA);
