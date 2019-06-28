import * as cocoSSD from '@tensorflow-models/coco-ssd';
import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import {
    configStorageKey,
    defaultConfigValues,
    eyelidPosition,
    FPS,
    middleX,
    middleY,
    pupilSizes,
} from './AppConstants';
import ConfigMenuElement from './components/configMenu/ConfigMenuElement';
import InterfaceUserConfig from './components/configMenu/InterfaceUserConfig';
import EyeController from './components/eye/EyeController';
import {
    analyseLight,
    checkLight,
    naturalMovement,
} from './components/eye/EyeUtils';
import Video from './components/video/Video';
import { IRootStore } from './store/reducers/rootReducer';
import { getDeviceIds, getVideos } from './store/selectors/videoSelectors';
interface IAppState {
    width: number;
    height: number;
    webcamAvailable: boolean;
    isBlinking: boolean;
    isSquinting: boolean;
    userConfig: InterfaceUserConfig;
    targetX: number;
    targetY: number;
    tooBright: boolean;
    direction: boolean;
    dilationCoefficient: number;
    modelLoaded: boolean;
    personDetected: boolean;
    eyesOpenCoefficient: number;
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
            isBlinking: false,
            isSquinting: false,
            targetX: this.props.environment.innerWidth / 4,
            targetY: this.props.environment.innerHeight / 2,
            tooBright: false,
            direction: true,
            dilationCoefficient: pupilSizes.neutral,
            eyesOpenCoefficient: eyelidPosition.OPEN,
            modelLoaded: false,
            personDetected: false,
            userConfig: this.readConfig() || defaultConfigValues,
        };

        this.updateDimensions = this.updateDimensions.bind(this);
        this.onUserMedia = this.onUserMedia.bind(this);
        this.onUserMediaError = this.onUserMediaError.bind(this);
        this.detectImage = this.detectImage.bind(this);
        this.setDilation = this.setDilation.bind(this);
        this.isNewTarget = this.isNewTarget.bind(this);
        this.hasTargetLeft = this.hasTargetLeft.bind(this);
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
        if (img !== null) {
            const [isBright, pupilSize] = checkLight(
                this.state.tooBright,
                img,
                analyseLight,
            );

            this.setDilation(pupilSize);

            if (isBright) {
                this.setState({
                    tooBright: true,
                    eyesOpenCoefficient: eyelidPosition.CLOSED,
                });
            } else if (this.state.tooBright) {
                this.setState({
                    tooBright: false,
                    eyesOpenCoefficient: eyelidPosition.OPEN,
                });
            }

            this.setState({ dilationCoefficient: pupilSize });

            if (this.model) {
                const detections = await this.model.detect(img);
                this.selectTarget(detections);
            }
        }
    }

    selectTarget(detections: cocoSSD.DetectedObject[]) {
        const target = detections.find(
            detection => detection.class === 'person',
        );

        if (target !== undefined) {
            this.calculateEyePos(target.bbox);
            this.isNewTarget();
        } else {
            if (Math.abs(this.state.targetX) > 1) {
                this.setState({ targetX: 0 });
            }
            this.hasTargetLeft();
            const [newX, newDirection] = naturalMovement(
                this.state.targetX,
                this.state.direction,
            );
            this.setState({
                targetY: 0,
                targetX: newX,
                direction: newDirection,
            });
        }
    }

    isNewTarget() {
        if (!this.state.personDetected) {
            this.setState({
                personDetected: true,
                targetX: middleX,
                targetY: middleY,
            });
            this.setDilation(pupilSizes.dilated);
            this.setDilation(pupilSizes.neutral);
        }
    }

    hasTargetLeft() {
        if (this.state.personDetected) {
            this.setState({ personDetected: false, isSquinting: true });
            this.setDilation(pupilSizes.constricted);
            this.setDilation(pupilSizes.neutral);
            this.setState({ eyesOpenCoefficient: eyelidPosition.SQUINT });
        }

        if (this.state.isSquinting && Math.random() < 0.05) {
            this.setState({
                eyesOpenCoefficient: eyelidPosition.OPEN,
                isSquinting: false,
            });
        }
    }

    calculateEyePos(bbox: number[]) {
        const [x, y, width, height] = bbox;
        this.setState({
            targetX: 2 * ((x + width / 2) / this.props.videos[0]!.width - 0.5), // scaled to value between -1 and 1
            targetY:
                2 * ((y + height / 2) / this.props.videos[0]!.height - 0.5), // scaled to value between -1 and 1
        });
    }

    setDilation(pupilSize: number) {
        this.setState(() => ({
            dilationCoefficient: pupilSize,
        }));
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
                            userConfig={this.state.userConfig}
                            environment={this.props.environment}
                            targetX={this.state.targetX}
                            targetY={this.state.targetY}
                            dilationCoefficient={this.state.dilationCoefficient}
                            openCoefficient={this.state.eyesOpenCoefficient}
                        />
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
