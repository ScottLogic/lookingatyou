import * as cocoSSD from '@tensorflow-models/coco-ssd';
import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import {
    blinkFrequency,
    buffer,
    colours,
    configStorageKey,
    defaultConfigValues,
    dilationMultipler,
    dilationOffset,
    eyelidPosition,
    eyes,
    FPS,
    maxBrightness,
    middleX,
    middleY,
    moveSize,
    pupilSizes,
    transitionTime,
    xIncrement,
} from './AppConstants';
import ConfigMenuElement from './components/configMenu/ConfigMenuElement';
import InterfaceUserConfig from './components/configMenu/InterfaceUserConfig';
import Eye from './components/eye/Eye';
import Video from './components/video/Video';
import { IRootStore } from './store/reducers/rootReducer';
import { getDeviceIds, getVideos } from './store/selectors/videoSelectors';
interface IAppState {
    width: number;
    height: number;
    eyesDilatedCoefficient: number;
    eyesOpenCoefficient: number;
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
    private blink: number = 0;
    private dilate: number = 0;

    constructor(props: AppProps) {
        super(props);

        this.state = {
            width: this.props.environment.innerWidth,
            height: this.props.environment.innerHeight,
            eyesDilatedCoefficient: 1,
            eyesOpenCoefficient: eyelidPosition.OPEN,
            webcamAvailable: false,
            isBlinking: false,
            isSquinting: false,
            targetX: this.props.environment.innerWidth / 4,
            targetY: this.props.environment.innerHeight / 2,
            tooBright: false,
            direction: true,
            dilationCoefficient: pupilSizes.neutral,
            modelLoaded: false,
            personDetected: false,
            userConfig: this.readConfig() || defaultConfigValues,
        };

        this.updateDimensions = this.updateDimensions.bind(this);
        this.onUserMedia = this.onUserMedia.bind(this);
        this.onUserMediaError = this.onUserMediaError.bind(this);
        this.detectImage = this.detectImage.bind(this);
        this.checkLight = this.checkLight.bind(this);
        this.isNewTarget = this.isNewTarget.bind(this);
        this.hasTargetLeft = this.hasTargetLeft.bind(this);
        this.moveEye = this.moveEye.bind(this);
        this.moveLeft = this.moveLeft.bind(this);
        this.moveRight = this.moveRight.bind(this);
        this.setDilation = this.setDilation.bind(this);
        this.analyseLight = this.analyseLight.bind(this);
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

        // Sets up random blinking animation
        this.blink = window.setInterval(() => {
            this.setState(state => ({
                isBlinking: state.isBlinking
                    ? false
                    : Math.random() < blinkFrequency / (1000 / transitionTime),
            }));
        }, transitionTime);
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
        clearInterval(this.blink);
        clearInterval(this.dilate);
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
            if (Math.random() < 0.05) {
                this.checkLight(img, this.analyseLight);
            }

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
            this.hasTargetLeft();
            this.naturalMovement();
        }
    }

    calculateEyePos(bbox: number[]) {
        const [x, y, width, height] = bbox;
        this.setState({
            targetX: x + width / 2,
            targetY: y + height / 2,
        });
    }

    naturalMovement() {
        if (this.state.targetX === middleX) {
            if (Math.random() < 0.01) {
                this.moveEye();
            }
        } else {
            this.moveEye();
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

        if (this.state.isSquinting && Math.random() < 0.1) {
            this.setState({
                eyesOpenCoefficient: eyelidPosition.OPEN,
                isSquinting: false,
            });
        }
    }

    setDilation(pupilSize: number) {
        this.setState(() => ({
            dilationCoefficient: pupilSize,
        }));
    }

    moveEye() {
        if (this.state.direction) {
            this.moveLeft();
        } else {
            this.moveRight();
        }
    }

    moveLeft() {
        if (this.state.targetX > middleX - xIncrement + buffer) {
            this.setState({ targetX: this.state.targetX - moveSize });
        } else if (Math.random() < 0.1) {
            this.setState({ direction: !this.state.direction });
        }
    }

    moveRight() {
        if (this.state.targetX < middleX + xIncrement - buffer) {
            this.setState({ targetX: this.state.targetX + moveSize });
        } else if (Math.random() < 0.1) {
            this.setState({ direction: !this.state.direction });
        }
    }

    checkLight(
        video:
            | ImageData
            | HTMLImageElement
            | HTMLCanvasElement
            | HTMLVideoElement
            | null,
        callback: (
            canvas: HTMLCanvasElement,
            callback: (n: number) => void,
        ) => void,
    ) {
        if (video && video instanceof HTMLVideoElement) {
            const canvas = document.createElement('canvas');
            canvas.height = video.height;
            canvas.width = video.width;
            const canvasCtx = canvas.getContext('2d');

            if (canvasCtx) {
                canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
                callback.call(this, canvas, this.setDilation);
            }
        }
    }

    analyseLight(canvas: HTMLCanvasElement, callback: (n: number) => void) {
        const ctx = canvas.getContext('2d');

        if (ctx && canvas.width > 0) {
            const imageData = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height,
            );

            const data = imageData.data;

            let colorSum = 0;

            for (let i = 0; i < data.length; i += 4) {
                const avg = Math.floor(
                    (data[i] + data[i + 1] + data[i + 2]) / 3,
                );

                colorSum += avg;
            }

            let brightness = Math.floor(
                colorSum / (canvas.width * canvas.height),
            );

            if (brightness > maxBrightness) {
                this.setState({
                    eyesOpenCoefficient: eyelidPosition.CLOSED,
                    tooBright: true,
                });
                brightness = maxBrightness;
            } else if (this.state.tooBright) {
                this.setState({
                    eyesOpenCoefficient: eyelidPosition.OPEN,
                    tooBright: false,
                });
            }

            const scaledPupilSize =
                ((maxBrightness - brightness) / maxBrightness) *
                    dilationMultipler +
                dilationOffset;

            callback(scaledPupilSize);
        }
    }

    render() {
        return (
            <div className="App">
                <div className="webcam-feed">
                    {this.props.deviceIds.map((device, key) => (
                        <Video key={key} deviceId={device} />
                    ))}
                </div>

                {this.props.deviceIds.length > 0 ? (
                    !(this.state.webcamAvailable && this.state.modelLoaded) ? (
                        <div className="loading-spinner" />
                    ) : (
                        <div className="container">
                            {Object.values(eyes).map((eye, key) => {
                                return (
                                    <Eye
                                        class={eye}
                                        key={key}
                                        width={this.state.width / 2}
                                        height={this.state.height}
                                        scleraColor={colours.scleraColor}
                                        irisColor={
                                            this.state.userConfig.irisColor
                                        }
                                        pupilColor={colours.pupilColor}
                                        scleraRadius={this.state.width / 5}
                                        irisRadius={this.state.width / 10}
                                        pupilRadius={this.state.width / 24}
                                        isBlinking={this.state.isBlinking}
                                        // 1 is neutral eye position; 0 or less is fully closed; larger than 1 makes eye look shocked
                                        openCoefficient={
                                            this.state.eyesOpenCoefficient
                                        }
                                        // factor by which to multiply the pupil radius - e.g. 0 is non-existant pupil, 1 is no dilation, 2 is very dilated
                                        dilatedCoefficient={
                                            this.state.dilationCoefficient
                                        }
                                        transitionTime={transitionTime.toString()}
                                        innerX={this.state.targetX}
                                        innerY={this.state.targetY}
                                    />
                                );
                            })}
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
