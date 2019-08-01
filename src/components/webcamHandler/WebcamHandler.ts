import { IVideo } from '../../store/actions/video/types';

const videoinput = 'videoinput';

export async function configureStreams(mediaDevices: MediaDevices) {
    const myStreams: { [key: string]: IVideo } = {};
    const devices = await enumerateDevices(mediaDevices);
    await Promise.all(
        devices.map(async deviceId => {
            const stream = await getStreamForDevice(mediaDevices, deviceId);
            if (stream) {
                myStreams[deviceId] = stream;
            }
        }),
    );
    return myStreams;
}

async function getStreamForDevice(
    mediaDevices: MediaDevices,
    deviceId: string,
) {
    const stream = await mediaDevices.getUserMedia({
        video: { deviceId, width: 320, height: 240 },
    });
    const streamSettings = stream.getVideoTracks()[0].getSettings();
    if (streamSettings.width && streamSettings.height) {
        return {
            width: streamSettings.width,
            height: streamSettings.height,
            deviceId,
            stream,
        };
    }
}

async function enumerateDevices(mediaDevices: MediaDevices) {
    const devices = await mediaDevices.enumerateDevices();
    return devices
        .filter(device => device.kind === videoinput)
        .map(device => device.deviceId);
}
