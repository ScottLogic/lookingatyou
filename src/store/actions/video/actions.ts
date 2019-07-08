import { Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import {
    enumerateDevices,
    getStreamForDevice,
} from '../../../components/webcamHandler/WebcamHandler';
import { IRootStore } from '../../reducers/rootReducer';
import {
    ISetVideoPayload,
    IVideo,
    REMOVE_VIDEO_STREAM,
    SET_VIDEO,
    SET_VIDEO_STREAM,
    TOGGLE_WEBCAM_AVAILABLE,
    VideoActionTypes,
} from './types';

export function setVideoAction(payload: ISetVideoPayload): VideoActionTypes {
    return {
        type: SET_VIDEO,
        payload,
    };
}

export function setVideoStreamAction(video: IVideo): VideoActionTypes {
    return {
        type: SET_VIDEO_STREAM,
        video,
    };
}

export function removeVideoStreamAction(deviceId: string): VideoActionTypes {
    return {
        type: REMOVE_VIDEO_STREAM,
        deviceId,
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
        console.log('test');
        const devices = await enumerateDevices(mediaDevices);
        const currentDevices = Object.keys(getState().videoStore.videos);
        const toBeAdded = arrayDiff(devices, currentDevices);
        const toBeRemoved = arrayDiff(currentDevices, devices);
        console.log('to be removed', toBeRemoved);
        console.log('to be added', toBeAdded);
        toBeAdded.map(async (device: string) => {
            const myStream = await getStreamForDevice(mediaDevices, device);
            if (myStream) {
                console.log('dispatched');
                dispatch(setVideoStreamAction(myStream));
                dispatch(toggleWebcamAvailable());
            }
        });
        toBeRemoved.map(async (device: string) => {
            console.log('removal dispatched');
            dispatch(removeVideoStreamAction(device));
            if (
                currentDevices.length -
                    toBeRemoved.length +
                    toBeAdded.length ===
                0
            ) {
                dispatch(toggleWebcamAvailable());
            }
        });
    };
}

function arrayDiff(original: string[], compared: string[]) {
    return original.filter(function(obj) {
        return !compared.some(function(obj2) {
            return obj === obj2;
        });
    });
}
