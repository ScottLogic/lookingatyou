import React, { useState, useEffect } from 'react';

interface IWebcamFeedProps {
  deviceId: string,
  onUserMedia: (stream: MediaStream) => void,
  onUserMediaError: (e: Error) => void,
}

const WebcamFeed = (props: IWebcamFeedProps) => {
  const [stream, setStream] = useState();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  async function getWebcam() {
    if (!stream) {
      try {
        const myStream = await getStream(props.deviceId);
        var streamSettings = myStream.getVideoTracks()[0].getSettings();
        if (streamSettings.height && streamSettings.width) {
          setStream(myStream);
          setWidth(streamSettings.width);
          setHeight(streamSettings.height);
        }
        props.onUserMedia(myStream);
      } catch (error) {
        props.onUserMediaError(error);
      }
    }
  };

  useEffect(() => {
    getWebcam();
  }, []);

  function getStream(deviceId: string) {
    return navigator.mediaDevices.getUserMedia({ video: { deviceId } })
  }

  return <video
    className={props.deviceId + ' hidden'}
    autoPlay={true}
    height={height}
    width={width}
    src={stream}
  />
}

export default WebcamFeed;
