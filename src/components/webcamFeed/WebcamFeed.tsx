import React, {  } from 'react';
import { connect } from 'react-redux';
import { SET_VIDEO, IVideo } from '../../store/actions/video/types';
import { Dispatch } from 'redux';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getStreamForDevice } from '../../store/selectors/videoSelectors';

interface IWebcamFeedProps {
  deviceId: string,
}

interface IDispatchProps {
  setVideo: (video: HTMLVideoElement) => void,
}

type Props = IWebcamFeedProps & IVideo & IDispatchProps;

const mapStateToProps = (state: IRootStore, deviceId: string) => {
  const video = getStreamForDevice(state, deviceId);
  console.log(video);
  return {...video};
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setVideo: (video: HTMLVideoElement) => dispatch({ type: SET_VIDEO, video: video }),
  }
}

class WebcamFeed extends React.Component<IWebcamFeedProps, {}> {

  getVideo(element: HTMLVideoElement | null) {
    if (element) {
      // element.srcObject = this.props.source;
      // this.props.setVideo(element);
    }
  }

  render() {
    return (
      <video
        className={'hidden'}
        autoPlay={true}
        // height={this.props.height}
        // width={this.props.width}
        ref={(element) => this.getVideo(element)}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WebcamFeed);
