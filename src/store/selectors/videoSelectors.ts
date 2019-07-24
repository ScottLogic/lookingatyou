import { IVideo } from '../actions/video/types';
import { IRootStore } from '../reducers/rootReducer';

export function getDeviceIds(state: IRootStore): string[] {
    const deviceIds = Object.keys(state.videoStore.videos);
    return deviceIds;
}

export function getStreamForDevice(
    state: IRootStore,
    deviceId: string,
): IVideo {
    return getDeviceIds(state)
        .filter((key: string) => key === deviceId)
        .map((key: string) => state.videoStore.videos[key])[0];
}

export function getVideos(
    state: IRootStore,
): Array<HTMLVideoElement | undefined> {
    return getDeviceIds(state).map(
        (deviceId: string) => state.videoStore.videos[deviceId].video,
    );
}

export function getWebcamAvailable(state: IRootStore): boolean {
    return state.videoStore.webcamAvailable;
}
