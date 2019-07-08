import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import ConfigMenuElement from './components/configMenu/ConfigMenuElement';
import DetectionHandler from './components/detectionHandler/DetectionHandler';
import EyeController from './components/eye/EyeController';
import MovementHandler from './components/intelligentMovement/MovementHandler';
import Video from './components/video/Video';
import { IObjectDetector } from './models/objectDetection';
import { IRootStore } from './store/reducers/rootReducer';
import { getDeviceIds } from './store/selectors/videoSelectors';
import { AppStore } from './store/store';

interface IAppState {
    width: number;
    height: number;
    webcamAvailable: boolean;
}

interface IAppProps {
    environment: Window;
    configureStream: (
        mediaDevices: MediaDevices,
        onUserMedia: () => void,
        onUserMediaError: () => void,
        store: AppStore,
    ) => void;
    store: AppStore;
}

interface IAppMapStateToProps {
    deviceIds: string[];
    model: IObjectDetector | null;
}

type AppProps = IAppProps & IAppMapStateToProps;

const mapStateToProps = (state: IRootStore): IAppMapStateToProps => {
    return {
        deviceIds: getDeviceIds(state),
        model: state.detectionStore.model,
    };
};

export class App extends React.PureComponent<AppProps, IAppState> {
    constructor(props: AppProps) {
        super(props);

        this.state = {
            width: this.props.environment.innerWidth,
            height: this.props.environment.innerHeight,
            webcamAvailable: false,
        };

        this.updateDimensions = this.updateDimensions.bind(this);
        this.onUserMedia = this.onUserMedia.bind(this);
        this.onUserMediaError = this.onUserMediaError.bind(this);
    }

    async componentDidMount() {
        this.props.environment.addEventListener(
            'resize',
            this.updateDimensions,
        );
        this.props.configureStream(
            this.props.environment.navigator.mediaDevices,
            this.onUserMedia,
            this.onUserMediaError,
            this.props.store,
        );
    }

    componentWillUnmount() {
        this.props.environment.removeEventListener(
            'resize',
            this.updateDimensions,
        );
    }

    updateDimensions() {
        this.setState({
            height: this.props.environment.innerHeight,
            width: this.props.environment.innerWidth,
        });
    }

    onUserMedia() {
        this.setState({
            webcamAvailable: true,
        });
    }

    onUserMediaError() {
        this.setState({ webcamAvailable: false });
    }

    render() {
        return (
            <div className="App">
                <div className="webcam-feed">
                    {this.props.deviceIds.map((device, key) => (
                        <Video key={key} deviceId={device} />
                    ))}
                </div>

                {this.state.webcamAvailable && <DetectionHandler />}

                {this.state.webcamAvailable ? (
                    !this.props.model ? (
                        <div className="loading-spinner" />
                    ) : (
                        <div>
                            <EyeController
                                width={this.state.width}
                                height={this.state.height}
                                environment={this.props.environment}
                            />
                            <MovementHandler
                                document={this.props.environment.document}
                            />
                        </div>
                    )
                ) : (
                    <div className="Error">
                        No webcam connected. Please connect a webcam and refresh
                    </div>
                )}

                <ConfigMenuElement window={this.props.environment.window} />
            </div>
        );
    }
}

export default connect(mapStateToProps)(App);
