import React, {  } from 'react';
import { connect } from 'react-redux';
import { SET_VIDEO, IVideo, ISetVideoPayload } from '../../store/actions/video/types';
import { Dispatch } from 'redux';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getStreamForDevice } from '../../store/selectors/videoSelectors';

interface IWebcamFeedProps {
  deviceId: string,
}

interface IDispatchProps {
  setVideo: (payload: ISetVideoPayload) => void,
}

type Props = IWebcamFeedProps & IVideo & IDispatchProps;

const mapStateToProps = (state: IRootStore, props: IWebcamFeedProps) => {
  return getStreamForDevice(state, props.deviceId);
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setVideo: (payload: ISetVideoPayload) => dispatch({ type: SET_VIDEO, payload: payload }),
  }
}

function Video(props: Props) {

  function getVideo(element: HTMLVideoElement | null) {
    if (element && props.stream) {
      element.srcObject = props.stream;
      const payload = {
        video: element,
        deviceId: props.deviceId,
      }
      props.setVideo(payload);
    }
  }

  return (
    <video
      className={props.deviceId + ' hidden'}
      autoPlay={true}
      height={props.height}
      width={props.width}
      ref={(element) => getVideo(element)}
    />
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Video);
