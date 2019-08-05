import { ICoords } from '../../utils/types';
import { IVideo } from '../actions/video/types';
import { IRootStore } from '../reducers/rootReducer';

export function getStreamForDevice(state: IRootStore): IVideo | undefined {
    return state.videoStore.video;
}

export function getVideoDimensions(state: IRootStore) {
    const video = getVideo(state);
    if (video) {
        return { width: video.width, height: video.height };
    } else {
        return undefined;
    }
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
