import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import ConfigMenuElement from './components/configMenu/ConfigMenuElement';
import IUserConfig from './components/configMenu/IUserConfig';
import EyeController from './components/eye/EyeController';
import Video from './components/video/Video';
import { IObjectDetector } from './models/objectDetection';
import { IRootStore } from './store/reducers/rootReducer';
import { getConfig } from './store/selectors/configSelectors';
import { getDeviceIds, getVideos } from './store/selectors/videoSelectors';
import CocoSSD from './utils/objectDetection/cocoSSD';
import selectFirst from './utils/objectSelection/selectFirst';
import calculateFocus, {
    normalise,
} from './utils/objectTracking/calculateFocus';
import { DetectionImage } from './utils/types';

interface IAppState {
    width: number;
    height: number;
    webcamAvailable: boolean;
    targetX: number;
    targetY: number;
    modelLoaded: boolean;
}

interface IAppProps {
    environment: Window;
    configureStream: (
        mediaDevices: MediaDevices,
        onUserMedia: () => void,
        onUserMediaError: () => void,
    ) => void;
}

interface IAppMapStateToProps {
    deviceIds: string[];
    videos: Array<HTMLVideoElement | undefined>;
    config: IUserConfig;
}

type AppProps = IAppProps & IAppMapStateToProps;

const mapStateToProps = (state: IRootStore): IAppMapStateToProps => {
    return {
        deviceIds: getDeviceIds(state),
        videos: getVideos(state),
        config: getConfig(state),
    };
};

export class App extends React.Component<AppProps, IAppState> {
    begunLoadingModel: boolean = false;
    private model: IObjectDetector | null;
    private captureInterval: number;

    constructor(props: AppProps) {
        super(props);

        this.state = {
            width: this.props.environment.innerWidth,
            height: this.props.environment.innerHeight,
            webcamAvailable: false,
            targetX: this.props.environment.innerWidth / 4,
            targetY: this.props.environment.innerHeight / 2,
            modelLoaded: false,
        };

        this.updateDimensions = this.updateDimensions.bind(this);
        this.onUserMedia = this.onUserMedia.bind(this);
        this.onUserMediaError = this.onUserMediaError.bind(this);
        this.detectionHandler = this.detectionHandler.bind(this);
        this.model = null;
        this.captureInterval = 0;
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
        );
<<<<<<< HEAD
=======
        const json = this.props.environment.localStorage.getItem(
            configStorageKey,
        );
        if (json != null) {
            // this dispatch call is removed in PR #138
            store.dispatch(
                updateConfigAction({
                    partialConfig: JSON.parse(json),
                }),
            );
        }
>>>>>>> removed direct store.dispatch() calls
    }

    async componentDidUpdate(previousProps: AppProps) {
        if (previousProps.config !== this.props.config) {
            clearInterval(this.captureInterval);
            this.captureInterval = setInterval(
                this.detectionHandler,
                1000 / this.props.config.fps,
                this.props.videos[0],
            );
        }
        if (!this.begunLoadingModel && this.props.deviceIds.length > 0) {
            this.begunLoadingModel = true;
            await this.setState({ webcamAvailable: true });
            this.model = await CocoSSD.init();
            this.setState({ modelLoaded: true });
        }
    }

    componentWillUnmount() {
        this.props.environment.removeEventListener(
            'resize',
            this.updateDimensions,
        );
        clearInterval(this.captureInterval);
    }

    updateDimensions() {
        this.setState({
            height: this.props.environment.innerHeight,
            width: this.props.environment.innerWidth,
            targetX: this.props.environment.innerWidth / 4,
            targetY: this.props.environment.innerHeight / 2,
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

                {this.state.webcamAvailable ? (
                    !this.state.modelLoaded ? (
                        <div className="loading-spinner" />
                    ) : (
                        <EyeController
                            width={this.state.width}
                            height={this.state.height}
                            environment={this.props.environment}
                            targetX={this.state.targetX}
                            targetY={this.state.targetY}
                        />
                    )
                ) : (
                    <div className="Error">
                        No webcam connected. Please connect a webcam and refresh
                    </div>
                )}

                <ConfigMenuElement
                    storage={this.props.environment.localStorage}
                />
            </div>
        );
    }

    async detectionHandler(image: DetectionImage) {
        if (this.model) {
            const detections = await this.model.detect(image);
            const selection = selectFirst(detections);
            const coords = calculateFocus(selection);
            if (coords) {
                this.setState({
                    targetX: normalise(coords.x, image.width),
                    targetY: normalise(coords.y, image.height),
                });
            }
        }
    }
}

export default connect(mapStateToProps)(App);
