import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { configureStreams } from '../../../components/webcamHandler/WebcamHandler';
import { IRootStore } from '../../reducers/rootReducer';
import {
    IVideo,
    SET_IMAGE_DATA,
    SET_VIDEO,
    SET_VIDEO_STREAMS,
    TOGGLE_WEBCAM_AVAILABLE,
    VideoActionTypes,
} from './types';

export function setVideoAction(payload: HTMLVideoElement): VideoActionTypes {
    return {
        type: SET_VIDEO,
        payload,
    };
}

export function setVideoStreamsAction(videos: IVideo): VideoActionTypes {
    return {
        type: SET_VIDEO_STREAMS,
        video: videos,
    };
}

export function toggleWebcamAvailable(): VideoActionTypes {
    return {
        type: TOGGLE_WEBCAM_AVAILABLE,
    };
}

export function setStream(mediaDevices: MediaDevices) {
    return async (
        dispatch: ThunkDispatch<IRootStore, void, Action>,
        getState: () => IRootStore,
    ) => {
        const streams = await configureStreams(mediaDevices);
        if (streams) {
            dispatch(setVideoStreamsAction(streams));
            const videoStore = getState().videoStore;
            const streamsLength = Object.keys(streams).length;
            if (
                (videoStore.webcamAvailable && streamsLength === 0) ||
                (!videoStore.webcamAvailable && streamsLength > 0)
            ) {
                dispatch(toggleWebcamAvailable());
            }
        }
    };
}

export function setImageDataAction(image: ImageData): VideoActionTypes {
    return {
        type: SET_IMAGE_DATA,
        image,
    };
}
