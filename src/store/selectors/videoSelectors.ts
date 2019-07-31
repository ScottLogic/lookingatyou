import { IVideo } from '../actions/video/types';
import { IRootStore } from '../reducers/rootReducer';

export function getStreamForDevice(state: IRootStore): IVideo | undefined {
    return state.videoStore.video;
}

export function getVideo(state: IRootStore): HTMLVideoElement | undefined {
    if (state.videoStore.video) {
        return state.videoStore.video.videoElement;
    }
}

export function getWebcamAvailable(state: IRootStore): boolean {
    return state.videoStore.webcamAvailable;
}

export function getImageData(state: IRootStore): ImageData {
    return state.videoStore.image;
}
