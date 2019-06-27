/* tslint:disable: jsx-no-lambda radix only-arrow-functions */

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
import CanvasMenuItem from './components/configMenu/CanvasMenuItem';
import CheckBoxMenuItem from './components/configMenu/CheckBoxMenuItem';
import ColorMenuItem from './components/configMenu/ColorMenuItem';
import ConfigMenu from './components/configMenu/ConfigMenu';
import IUserConfig from './components/configMenu/InterfaceUserConfig';
import TextBoxMenuItem from './components/configMenu/TextBoxMenuItem';
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
    userConfig: IUserConfig;
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
    private leftDebugRef: React.RefObject<CanvasMenuItem>;
    private rightDebugRef: React.RefObject<CanvasMenuItem>;
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
            userConfig:
                this.readConfig(configStorageKey) || defaultConfigValues,
            modelLoaded: false,
            personDetected: false,
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

        this.leftDebugRef = React.createRef();
        this.rightDebugRef = React.createRef();

        this.props.environment.addEventListener('storage', () =>
            this.readConfig(configStorageKey),
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
        if (!this.state.modelLoaded) {
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

                <ConfigMenu width="14em" timerLength={1000}>
                    <TextBoxMenuItem
                        name={'X Sensitivity'}
                        defaultValue={`${this.state.userConfig.xSensitivity}`}
                        isValidInput={(sens: string) =>
                            !isNaN(parseFloat(sens))
                        }
                        onValidInput={(sens: string) =>
                            this.store(configStorageKey, {
                                xSensitivity: parseFloat(sens),
                            })
                        }
                        parse={(text: string) => `${parseFloat(text)}`}
                    />
                    <TextBoxMenuItem
                        name={'Y Sensitivity'}
                        defaultValue={`${this.state.userConfig.ySensitivity}`}
                        isValidInput={(sens: string) =>
                            !isNaN(parseFloat(sens))
                        }
                        onValidInput={(sens: string) =>
                            this.store(configStorageKey, {
                                ySensitivity: parseFloat(sens),
                            })
                        }
                        parse={(text: string) => `${parseFloat(text)}`}
                    />
                    <TextBoxMenuItem
                        name={'FPS'}
                        defaultValue={`${this.state.userConfig.fps}`}
                        isValidInput={(fps: string) => !isNaN(parseInt(fps))}
                        onValidInput={(fps: string) =>
                            this.store(configStorageKey, {
                                fps: parseInt(fps),
                            })
                        }
                        parse={(text: string) => `${parseInt(text)}`}
                    />
                    <CheckBoxMenuItem
                        name={'Swap Eyes'}
                        checked={this.state.userConfig.swapEyes}
                        onInputChange={(swapEyes: boolean) =>
                            this.store(configStorageKey, { swapEyes })
                        }
                    />
                    <CheckBoxMenuItem
                        name={'Toggle Debug'}
                        checked={this.state.userConfig.toggleDebug}
                        onInputChange={(toggleDebug: boolean) =>
                            this.store(configStorageKey, { toggleDebug })
                        }
                    />
                    <ColorMenuItem
                        name={'Iris Color'}
                        color={this.state.userConfig.irisColor}
                        onInputChange={(irisColor: string) =>
                            this.store(configStorageKey, { irisColor })
                        }
                    />
                    <CanvasMenuItem
                        name={'Left Camera'}
                        ref={this.leftDebugRef}
                    />
                    <CanvasMenuItem
                        name={'Right Camera'}
                        ref={this.rightDebugRef}
                    />
                </ConfigMenu>
            </div>
        );
    }

    store(key: string, partialState: Partial<IUserConfig>) {
        const newUserConfig: IUserConfig = {
            ...this.state.userConfig,
            ...partialState,
        };
        this.setState(
            {
                userConfig: newUserConfig,
            },
            () => {
                const json = JSON.stringify(this.state.userConfig);
                this.props.environment.localStorage.setItem(key, json);
            },
        );
    }

    readConfig(key: string) {
        const json = this.props.environment.localStorage.getItem(key);
        if (json != null) {
            return JSON.parse(json);
        } else {
            return null;
        }
    }
}

export default connect(mapStateToProps)(App);
