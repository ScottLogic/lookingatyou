import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { setVideoAction } from '../../store/actions/video/actions';
import { IVideo } from '../../store/actions/video/types';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getStreamForDevice } from '../../store/selectors/videoSelectors';

interface IDispatchProps {
    setVideo: (payload: HTMLVideoElement) => void;
}

export type VideoProps = IVideo & IDispatchProps;

export function Video(props: VideoProps) {
    function getVideo(element: HTMLVideoElement | null) {
        if (element && props.stream) {
            element.srcObject = props.stream;
            props.setVideo(element);
        }
    }

    return (
        <video
            className={'hidden'}
            autoPlay={true}
            height={props.height}
            width={props.width}
            ref={element => getVideo(element)}
        />
    );
}

const mapStateToProps = (state: IRootStore) => getStreamForDevice(state);

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setVideo: (payload: HTMLVideoElement) => dispatch(setVideoAction(payload)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Video);
