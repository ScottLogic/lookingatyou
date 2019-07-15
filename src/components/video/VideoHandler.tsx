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
    configureStream: (mediaDevices: MediaDevices) => Promise<void>;
}

interface IVideoHandlerProps {
    mediaDevices: MediaDevices | null;
}

export type VideoHandlerProps = IVideoHandlerProps &
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

export const VideoHandler = React.memo(
    (props: VideoHandlerProps) => {
        const { mediaDevices, configureStream } = { ...props };

        useEffect(() => {
            if (mediaDevices) {
                configureStream(mediaDevices);
                mediaDevices.ondevicechange = () => {
                    if (mediaDevices) {
                        configureStream(mediaDevices);
                    }
                };
            }
        }, [mediaDevices, configureStream]);
        return (
            <div className="webcam-feed">
                {props.deviceIds.map((device, key) => (
                    <Video key={key} deviceId={device} />
                ))}
            </div>
        );
    },
    (previous, next) => previous.deviceIds === next.deviceIds,
);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(VideoHandler);
