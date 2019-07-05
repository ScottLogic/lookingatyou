import { SET_VIDEO_STREAMS } from '../../store/actions/video/types';
import { AppStore } from '../../store/store';

const videoinput = 'videoinput';

export default async function configureStream(
    mediaDevices: MediaDevices,
    onUserMedia: () => void,
    onUserMediaError: () => void,
    store: AppStore,
) {
    try {
        const devices = await enumerateDevices(mediaDevices);
        const streams = await Promise.all(
            devices.map(async deviceId => {
                const stream = await getStream(mediaDevices, deviceId);
                return {
                    deviceId,
                    stream,
                };
            }),
        );
        const videos = streams.map(item => {
            const streamSettings = item.stream
                .getVideoTracks()[0]
                .getSettings();
            if (streamSettings.width && streamSettings.height) {
                return {
                    width: streamSettings.width,
                    height: streamSettings.height,
                    ...item,
                };
            }
            return [];
        });
        store.dispatch({ type: SET_VIDEO_STREAMS, videos });
        if (videos.length > 0) {
            onUserMedia();
        } else {
            onUserMediaError();
        }
    } catch (error) {
        onUserMediaError();
    }
}

async function enumerateDevices(mediaDevices: MediaDevices) {
    const devices = await mediaDevices.enumerateDevices();
    return devices
        .filter(device => device.kind === videoinput)
        .map(device => device.deviceId);
}

async function getStream(mediaDevices: MediaDevices, deviceId: string) {
    return mediaDevices.getUserMedia({
        video: { deviceId, width: { exact: 320 }, height: { exact: 240 } },
    });
}
