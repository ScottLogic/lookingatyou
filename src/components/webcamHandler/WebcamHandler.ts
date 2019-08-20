export async function configureStream(mediaDevices: MediaDevices) {
    try {
        const stream = await mediaDevices.getUserMedia({
            video: { width: 320, height: 240 },
        });
        const streamSettings = stream.getVideoTracks()[0].getSettings();
        if (streamSettings.width && streamSettings.height) {
            return {
                width: streamSettings.width,
                height: streamSettings.height,
                stream,
            };
        }
    } catch {
        return undefined;
    }
}
