export async function configureStreams(mediaDevices: MediaDevices) {
    try {
        const stream = await mediaDevices.getUserMedia({
            video: true,
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
