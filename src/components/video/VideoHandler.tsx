import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { setStream } from '../../store/actions/video/actions';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getDeviceIds } from '../../store/selectors/videoSelectors';
import Video from './Video';

interface IVideoHandlerStateToProps {
    deviceIds: string[];
}

interface IVideoHandlerDispatchProps {
    configureStream: (mediaDevices: MediaDevices) => any;
}

interface IVideoHandlerProps {
    mediaDevices: MediaDevices;
}

type VideoHandlerProps = IVideoHandlerProps &
    IVideoHandlerStateToProps &
    IVideoHandlerDispatchProps;

const mapStateToProps = (state: IRootStore) => {
    return {
        deviceIds: getDeviceIds(state),
    };
};

const mapDispatchToProps = (
    dispatch: ThunkDispatch<IRootStore, void, Action>,
): IVideoHandlerDispatchProps => ({
    configureStream: (mediaDevices: MediaDevices) =>
        dispatch(setStream(mediaDevices)),
});

function VideoHandler(props: VideoHandlerProps) {
    useEffect(() => {
        props.configureStream(props.mediaDevices);
        props.mediaDevices.ondevicechange = () => {
            console.log('device changed');
            props.configureStream(props.mediaDevices);
        };
    }, []);

    return (
        <div className="webcam-feed">
            {props.deviceIds.map((device, key) => (
                <Video key={key} deviceId={device} />
            ))}
        </div>
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(VideoHandler);
