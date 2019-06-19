import React, { useState, useEffect } from 'react';

interface IWebcamFeedProps {
  deviceId: string,
  onUserMedia: (stream: MediaStream) => void,
  onUserMediaError: () => void,
}

const WebcamFeed = (props: IWebcamFeedProps) => {
  const [stream, setStream] = useState();
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();

  async function getWebcam() {
    try {
      const myStream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: props.deviceId } });
      if (myStream !== undefined) {
        setStream(myStream);
        var streamSettings = myStream.getVideoTracks()[0].getSettings();
        if (streamSettings.height && streamSettings.width) {
          setHeight(streamSettings.height);
          setWidth(streamSettings.width);
        }
        props.onUserMedia(myStream);
      }
    } catch {
      props.onUserMediaError();
    }
  };

  useEffect(() => {
    getWebcam();
  });

  return <video
    className={props.deviceId + ' hidden'}
    autoPlay={true}
    height={height}
    width={width}
    src={stream}
  />
}

export default WebcamFeed;
