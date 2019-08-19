import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { configureStream } from '../../../components/webcamHandler/WebcamHandler';
import { IRootStore } from '../../reducers/rootReducer';
import { createAction, createActionPayload } from '../creators';
import {
    IVideo,
    SET_IMAGE_DATA,
    SET_VIDEO,
    SET_VIDEO_STREAM,
    TOGGLE_WEBCAM_AVAILABLE,
} from './types';

export function setStream(mediaDevices: MediaDevices) {
    return async (
        dispatch: ThunkDispatch<IRootStore, void, Action>,
        getState: () => IRootStore,
    ) => {
        const stream = await configureStream(mediaDevices);
        const webcamAvailable = getState().videoStore.webcamAvailable;
        if (stream) {
            dispatch(setVideoStreamAction(stream));
            if (!webcamAvailable) {
                dispatch(toggleWebcamAvailable());
            }
        } else {
            if (webcamAvailable) {
                dispatch(toggleWebcamAvailable());
            }
        }
    };
}

export const setVideoAction = createActionPayload<
    typeof SET_VIDEO,
    HTMLVideoElement
>(SET_VIDEO);

export const setVideoStreamAction = createActionPayload<
    typeof SET_VIDEO_STREAM,
    IVideo
>(SET_VIDEO_STREAM);

export const toggleWebcamAvailable = createAction<
    typeof TOGGLE_WEBCAM_AVAILABLE
>(TOGGLE_WEBCAM_AVAILABLE);

export const setImageDataAction = createActionPayload<
    typeof SET_IMAGE_DATA,
    ImageData
>(SET_IMAGE_DATA);
