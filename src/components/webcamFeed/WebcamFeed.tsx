import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { IVideoState, SET_VIDEO, IDimensions, SET_DIMENSIONS } from '../../store/actions/video/types';
import { Dispatch } from 'redux';
import { getDimensions, getVideo } from '../../store/reducers/videoReducer';

interface IWebcamFeedProps {
  deviceId: string,
  onUserMedia: (stream: MediaStream) => void,
  onUserMediaError: (e: Error) => void,
  setDimensions: (dimensions: IDimensions) => void,
  setVideo: (video: HTMLVideoElement) => void,
  video: HTMLVideoElement | null,
  dimensions: IDimensions,
}

const mapStateToProps = (state: IVideoState) => {
  return {
    video: getVideo(state),
    dimensions: getDimensions(state),
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setDimensions: (dimensions: IDimensions) => dispatch({ type: SET_DIMENSIONS, payload: dimensions }),
    setVideo: (video: HTMLVideoElement) => dispatch({ type: SET_VIDEO, payload: video }),
  }
}

function WebcamFeed(props: IWebcamFeedProps) {
  const [video, setVideo] = useState();

  function getVideo(element: HTMLVideoElement) {
    if (element) {
      setVideo(video);
    }
  }

  async function getWebcam() {
    if (!video && !props.video) {
      try {
        const myStream = await getStream(props.deviceId);
        var streamSettings = myStream.getVideoTracks()[0].getSettings();
        if (streamSettings.height && streamSettings.width) {
          props.setDimensions({ width: streamSettings.width, height: streamSettings.height })
        }

  function getStream(deviceId: string) {
    return navigator.mediaDevices.getUserMedia({ video: { deviceId } })
  }

  useEffect(() => {
    getWebcam();
  })

  return (
    <video
      className={props.deviceId + ' hidden'}
      autoPlay={true}
      height={props.dimensions.height}
      width={props.dimensions.width}
      ref={getVideo}
    />
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(WebcamFeed);
