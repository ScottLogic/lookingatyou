const videoinput = 'videoinput';

export async function getStreamForDevice(
    mediaDevices: MediaDevices,
    deviceId: string,
) {
    console.log(deviceId);
    const stream = await mediaDevices.getUserMedia({
        video: { deviceId },
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

export async function enumerateDevices(mediaDevices: MediaDevices) {
    const devices = await mediaDevices.enumerateDevices();
    return devices
        .filter(device => device.kind === videoinput)
        .map(device => device.deviceId);
}
