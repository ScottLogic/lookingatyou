import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    ISetVideoPayload,
    IVideo,
    SET_VIDEO,
} from '../../store/actions/video/types';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getStreamForDevice } from '../../store/selectors/videoSelectors';

interface IVideoProps {
    deviceId: string;
}

interface IDispatchProps {
    setVideo: (payload: ISetVideoPayload) => void;
}

export type VideoProps = IVideoProps & IVideo & IDispatchProps;

const mapStateToProps = (state: IRootStore, props: IVideoProps) => {
    return getStreamForDevice(state, props.deviceId);
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setVideo: (payload: ISetVideoPayload) =>
            dispatch({ type: SET_VIDEO, payload }),
    };
};

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
            autoPlay={true}
            height={props.height}
            width={props.width}
            ref={element => getVideo(element)}
        />
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Video);
