import { IVideo } from '../actions/video/types';
import { IRootStore } from '../reducers/rootReducer';

export function getDeviceIds(state: IRootStore): string[] {
    const deviceIds = Object.keys(state.videoStore.videos).map(
        (deviceId: string) => deviceId,
    );
    if (state.configStore.config.swapEyes) {
        deviceIds.reverse();
    }
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
    const videos = getDeviceIds(state).map(
        (deviceId: string) => state.videoStore.videos[deviceId].video,
    );
    return videos;
}
