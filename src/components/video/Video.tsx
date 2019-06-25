import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    ISetVideoPayload,
    IVideo,
    SET_VIDEO,
} from '../../store/actions/video/types';
import { IVideo, SET_VIDEO } from '../../store/actions/video/types';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getStreamForDevice } from '../../store/selectors/videoSelectors';

<<<<<<< HEAD
interface IWebcamFeedProps {
    deviceId: string;
=======
interface IVideoProps {
  deviceId: string,
>>>>>>> added enzyme to the project and 2 tests for the Video component
}

interface IDispatchProps {
    setVideo: (payload: ISetVideoPayload) => void;
}

export type VideoProps = IVideoProps & IVideo & IDispatchProps;

<<<<<<< HEAD
const mapStateToProps = (state: IRootStore, props: IWebcamFeedProps) => {
    return getStreamForDevice(state, props.deviceId);
};
=======
const mapStateToProps = (state: IRootStore, props: IVideoProps) => {
  return getStreamForDevice(state, props.deviceId);
}
>>>>>>> added enzyme to the project and 2 tests for the Video component

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setVideo: (payload: ISetVideoPayload) =>
            dispatch({ type: SET_VIDEO, payload }),
    };
};

<<<<<<< HEAD
function Video(props: Props) {
    function getVideo(element: HTMLVideoElement | null) {
        if (element && props.stream) {
            element.srcObject = props.stream;
            const payload = {
                video: element,
                deviceId: props.deviceId,
            };
            props.setVideo(payload);
        }
    }

    return (
        <video
            className={props.deviceId + ' hidden'}
            autoPlay={true}
            height={props.height}
            width={props.width}
            ref={element => getVideo(element)}
        />
    );
=======
export function Video(props: VideoProps) {

  function getVideo(element: HTMLVideoElement | null) {
    if (element && props.stream) {
      element.srcObject = props.stream;
      const payload = {
        video: element,
        deviceId: props.deviceId,
      };
      props.setVideo(payload);
    }
  }

  return (
    <video
      className={'hidden'}
      autoPlay={true}
      height={props.height}
      width={props.width}
      ref={(element) => getVideo(element)}
    />
  )
>>>>>>> added enzyme to the project and 2 tests for the Video component
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Video);
