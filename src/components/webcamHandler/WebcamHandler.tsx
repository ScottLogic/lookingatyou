import store from '../../store/store';
import { SET_VIDEO_STREAMS } from '../../store/actions/video/types';

const videoinput = 'videoinput';

export default async function configureStream(mediaDevices: MediaDevices, onUserMedia: () => void) {
  try {
    const devices = await enumerateDevices(mediaDevices);
    const streams = await Promise.all(await devices.map(async deviceId => {
      const stream = await getStream(mediaDevices, deviceId);
      return {
        deviceId,
        stream
      }
    }))
    const videos = streams.map(item => {
      const streamSettings = item.stream.getVideoTracks()[0].getSettings();
      if (streamSettings.width && streamSettings.height) {
        return {
          width: streamSettings.width,
          height: streamSettings.height,
          ...item,
        }
      }
      return [];
    });
    store.dispatch({ type: SET_VIDEO_STREAMS, videos });
    onUserMedia();
  } catch (error) {
    console.error(error);
  }
}

async function enumerateDevices(mediaDevices: MediaDevices) {
  let devices = await mediaDevices.enumerateDevices();
  return devices.filter(device => device.kind === videoinput).map(device => device.deviceId);
}

async function getStream(mediaDevices: MediaDevices, deviceId: string) {
  return await mediaDevices.getUserMedia({ video: { deviceId } });
}
