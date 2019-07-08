const videoinput = 'videoinput';

export default async function configureStream(
    mediaDevices: MediaDevices,
    devices: string[],
) {
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
        const streamSettings = item.stream.getVideoTracks()[0].getSettings();
        if (streamSettings.width && streamSettings.height) {
            return {
                width: streamSettings.width,
                height: streamSettings.height,
                ...item,
            };
        }
        return null;
    });
    return videos;
}

export async function getStreamForDevice(
    mediaDevices: MediaDevices,
    deviceId: string,
) {
    console.log(deviceId);
    const stream = await getStream(mediaDevices, deviceId);
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

export async function enumerateDevices(mediaDevices: MediaDevices) {
    const devices = await mediaDevices.enumerateDevices();
    return devices
        .filter(device => device.kind === videoinput)
        .map(device => device.deviceId);
}

async function getStream(mediaDevices: MediaDevices, deviceId: string) {
    return mediaDevices.getUserMedia({
        video: { deviceId },
    });
}
