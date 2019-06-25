import { IRootStore } from "../reducers/rootReducer";
import { IVideo } from "../actions/video/types";

export function getDeviceIds(state: IRootStore): string[] {
  return Object.keys(state.videoStore.videos).map((deviceId: string) => deviceId);
}

export function getStreamForDevice(state: IRootStore, deviceId: string): IVideo {
  return Object.keys(state.videoStore.videos).filter((key: string) => key === deviceId).map((key: string) => state.videoStore.videos[key])[0];
}

export function getVideos(state: IRootStore): (HTMLVideoElement | undefined)[] {
  return Object.values(state.videoStore.videos).map((item: IVideo) => item.video);
}
