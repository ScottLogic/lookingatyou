import * as cocoSSD from '@tensorflow-models/coco-ssd';
import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import { configStorageKey, defaultConfigValues, FPS } from './AppConstants';
import ConfigMenuElement from './components/configMenu/ConfigMenuElement';
import InterfaceUserConfig from './components/configMenu/InterfaceUserConfig';
import EyeController from './components/eye/EyeController';
import Video from './components/video/Video';
import { IRootStore } from './store/reducers/rootReducer';
import { getDeviceIds, getVideos } from './store/selectors/videoSelectors';

interface IAppState {
    width: number;
    height: number;
    webcamAvailable: boolean;
    userConfig: InterfaceUserConfig;
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
}

type AppProps = IAppProps & IAppMapStateToProps;

const mapStateToProps = (state: IRootStore) => {
    return {
        deviceIds: getDeviceIds(state),
        videos: getVideos(state),
    };
};

export class App extends React.Component<AppProps, IAppState> {
    begunLoadingModel: boolean = false;
    private model: cocoSSD.ObjectDetection | null;
    private frameCapture: number;

    constructor(props: AppProps) {
        super(props);

        this.state = {
            width: this.props.environment.innerWidth,
            height: this.props.environment.innerHeight,
            webcamAvailable: false,
            targetX: this.props.environment.innerWidth / 4,
            targetY: this.props.environment.innerHeight / 2,
            userConfig: this.readConfig() || defaultConfigValues,
            modelLoaded: false,
        };

        this.updateDimensions = this.updateDimensions.bind(this);
        this.onUserMedia = this.onUserMedia.bind(this);
        this.onUserMediaError = this.onUserMediaError.bind(this);
        this.detectImage = this.detectImage.bind(this);
        this.store = this.store.bind(this);

        this.props.environment.addEventListener('storage', () =>
            this.readConfig(),
        );
        this.model = null;
        this.frameCapture = 0;
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
    }

    async componentDidUpdate() {
        if (!this.begunLoadingModel && this.props.deviceIds.length > 0) {
            this.begunLoadingModel = true;
            await this.setState({ webcamAvailable: true });
            this.model = await cocoSSD.load();
            this.setState({ modelLoaded: true });
            if (this.props.videos[0]) {
                this.frameCapture = setInterval(
                    this.detectImage,
                    1000 / FPS,
                    this.props.videos[0],
                );
            }
        }
    }

    componentWillUnmount() {
        this.props.environment.removeEventListener(
            'resize',
            this.updateDimensions,
        );
        clearInterval(this.frameCapture);
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

    async detectImage(
        img:
            | ImageData
            | HTMLImageElement
            | HTMLCanvasElement
            | HTMLVideoElement
            | null,
    ) {
        if (this.model && img !== null) {
            const detections = await this.model.detect(img);
            this.selectTarget(detections);
        }
    }

    selectTarget(detections: cocoSSD.DetectedObject[]) {
        const target = detections.find(
            detection => detection.class === 'person',
        );
        if (target !== undefined) {
            this.calculateEyePos(target.bbox);
        }
    }

    calculateEyePos(bbox: number[]) {
        this.store({ bbox });
        const [x, y, width, height] = bbox;
        this.setState({
            targetX: 2 * ((x + width / 2) / this.props.videos[0]!.width - 0.5), // scaled to value between -1 and 1
            targetY:
                2 * ((y + height / 2) / this.props.videos[0]!.height - 0.5), // scaled to value between -1 and 1
        });
    }

    render() {
        return (
            <div className="App">
                {this.state.webcamAvailable ? (
                    !this.state.modelLoaded ? (
                        <div className="loading-spinner" />
                    ) : (
                        <div>
                            <EyeController
                                width={this.state.width}
                                height={this.state.height}
                                userConfig={this.state.userConfig}
                                environment={this.props.environment}
                                targetX={this.state.targetX}
                                targetY={this.state.targetY}
                            />
                            <div className="webcam-feed">
                                {this.props.deviceIds.map((device, key) => (
                                    <Video key={key} deviceId={device} />
                                ))}
                            </div>
                        </div>
                    )
                ) : (
                    <div className="Error">
                        No webcam connected. Please connect a webcam and refresh
                    </div>
                )}

                <ConfigMenuElement
                    config={this.state.userConfig}
                    store={this.store}
                />
            </div>
        );
    }

    store(partialState: Partial<InterfaceUserConfig>) {
        const newUserConfig: InterfaceUserConfig = {
            ...this.state.userConfig,
            ...partialState,
        };
        this.setState(
            {
                userConfig: newUserConfig,
            },
            () => {
                const json = JSON.stringify(this.state.userConfig);
                this.props.environment.localStorage.setItem(
                    configStorageKey,
                    json,
                );
            },
        );
    }

    readConfig() {
        const json = this.props.environment.localStorage.getItem(
            configStorageKey,
        );
        if (json != null) {
            return JSON.parse(json);
        } else {
            return null;
        }
    }
}

export default connect(mapStateToProps)(App);
