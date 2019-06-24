import { IRootStore } from "../reducers/rootReducer";
import { IVideo, IVideoState } from "../actions/video/types";

export function getDeviceIds(state: IRootStore): string[] {
  console.log( state.videoStore.videos.map(item => item.deviceId))
  return state.videoStore.videos.map(item => item.deviceId);
}

export function getStreamForDevice(state: IRootStore, deviceId: string): IVideo {
  return state.videoStore.videos.filter(device => device.deviceId === deviceId)[0];
}
