/* tslint:disable: jsx-no-lambda radix ordered-imports only-arrow-functions */

import * as cocoSSD from '@tensorflow-models/coco-ssd';
import React, { RefObject } from 'react';

import './App.css';
import CanvasMenuItem from './components/configMenu/CanvasMenuItem';
import CheckBoxMenuItem from './components/configMenu/CheckBoxMenuItem';
import ColorMenuItem from './components/configMenu/ColorMenuItem';
import ConfigMenu from './components/configMenu/ConfigMenu';
import IUserConfig from './components/configMenu/InterfaceUserConfig';
import TextBoxMenuItem from './components/configMenu/TextBoxMenuItem';
import Eye from './components/eye/Eye';
import WebcamFeed from './components/webcamFeed/WebcamFeed';
import {
    blinkFrequency,
    colours,
    configStorageKey,
    defaultConfigValues,
    eyelidPosition,
    eyes,
    FPS,
    pupilSizeChangeInterval,
    pupilSizes,
    transitionTime,
    videoinput,
} from './AppConstants';
import { sumOutType } from '@tensorflow/tfjs-core/dist/types';

interface IAppState {
    width: number;
    height: number;
    webcams: MediaDeviceInfo[];
    eyesDilatedCoefficient: number;
    eyesOpenCoefficient: number;
    eyesDisplayed: boolean;
    isBlinking: boolean;
    userConfig: IUserConfig;
    videos: Array<RefObject<HTMLVideoElement>>;
    targetX: number;
    targetY: number;
    direction: boolean;
    dilationCoefficient: number;
    personDetected: boolean;
}

interface IAppProps {
    environment: Window;
}

class App extends React.Component<IAppProps, IAppState> {
    private leftDebugRef: React.RefObject<CanvasMenuItem>;
    private rightDebugRef: React.RefObject<CanvasMenuItem>;
    private model: cocoSSD.ObjectDetection | null;
    private frameCapture: number;
    private blink: number = 0;
    private dilate: number = 0;
    constructor(props: IAppProps) {
        super(props);

        this.state = {
            width: this.props.environment.innerWidth,
            height: this.props.environment.innerHeight,
            webcams: [],
            eyesDilatedCoefficient: 1,
            eyesOpenCoefficient: eyelidPosition.CLOSED,
            eyesDisplayed: false,
            isBlinking: false,
            videos: [],
            targetX: this.props.environment.innerWidth / 4,
            targetY: this.props.environment.innerHeight / 2,
            direction: true,
            dilationCoefficient: pupilSizes.neutral,
            userConfig:
                this.readConfig(configStorageKey) || defaultConfigValues,
            personDetected: false,
        };

        this.updateDimensions = this.updateDimensions.bind(this);
        this.onUserMedia = this.onUserMedia.bind(this);
        this.onUserMediaError = this.onUserMediaError.bind(this);
        this.detectImage = this.detectImage.bind(this);
        this.checkLight = this.checkLight.bind(this);
        this.isNewTarget = this.isNewTarget.bind(this);
        this.hasTargetLeft = this.hasTargetLeft.bind(this);
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
        this.getWebcamDevices();

        // Sets up random blinking animation
        this.blink = window.setInterval(() => {
            this.setState(state => ({
                isBlinking: state.isBlinking
                    ? false
                    : Math.random() < blinkFrequency / (1000 / transitionTime),
            }));
        }, transitionTime);

        // Sets up cyclical dilation animation
        /*this.dilate = window.setInterval(() => {
            this.setState(state => ({
                dilationCoefficient: (() => {
                    switch (state.dilationCoefficient) {
                        case pupilSizes.neutral:
                            return pupilSizes.dilated;
                        case pupilSizes.dilated:
                            return pupilSizes.constricted;
                        default:
                            return pupilSizes.neutral;
                    }
                })(),
            }));
        }, pupilSizeChangeInterval);*/

        this.model = await cocoSSD.load();
        if (this.state.videos[0]) {
            this.frameCapture = setInterval(
                this.detectImage,
                1000 / FPS,
                this.state.videos[0].current,
                this.checkLight,
            );
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

    async getWebcamDevices() {
        let devices = await navigator.mediaDevices.enumerateDevices();
        devices = devices.filter(device => device.kind === videoinput);
        this.setState({
            webcams: devices,
            videos: devices.map(() => React.createRef<HTMLVideoElement>()),
        });
    }

    updateDimensions() {
        this.setState({
            height: this.props.environment.innerHeight,
            width: this.props.environment.innerWidth,
            targetX: this.props.environment.innerWidth / 4,
            targetY: this.props.environment.innerHeight / 2,
        });
    }

    onUserMedia(stream: MediaStream) {
        this.setState({
            eyesDisplayed: true,
            eyesOpenCoefficient: eyelidPosition.OPEN,
        });
    }

    onUserMediaError() {
        this.setState({
            eyesDisplayed: false,
            eyesOpenCoefficient: eyelidPosition.CLOSED,
        });
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
            // this.checkLight(img);
            this.selectTarget(detections);
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
        const middleOfFrame = window.innerWidth / 4;

        if (this.state.targetX === middleOfFrame) {
            if (Math.random() < 0.05) {
                this.moveEye();
            }
        }
    }

    isNewTarget() {
        if (!this.state.personDetected) {
            this.setState({ personDetected: true });
            this.setDilation(pupilSizes.dilated);
            this.setDilation(pupilSizes.neutral);
        }
    }

    hasTargetLeft() {
        if (this.state.personDetected) {
            this.setState({ personDetected: false });
            this.setDilation(pupilSizes.constricted);
            this.setDilation(pupilSizes.neutral);
        }
    }

    setDilation(pupilSize: number) {
        window.setInterval(() => {
            this.setState(() => ({
                dilationCoefficient: pupilSize,
            }));
        }, 50);
    }

    moveEye() {
        if (this.state.direction) {
            this.moveLeft();
        } else {
            this.moveRight();
        }
    }

    moveLeft() {
        const middleX = window.innerWidth / 4;
        const xIncrement = window.innerWidth / 16;
        const buffer = 6;

        if (this.state.targetX > middleX - xIncrement + buffer) {
            this.setState({ targetX: this.state.targetX - 4 });
        } else {
            this.setState({ direction: !this.state.direction });
        }
    }

    moveRight() {
        const middleX = window.innerWidth / 4;
        const xIncrement = window.innerWidth / 16;
        const buffer = 6;

        if (this.state.targetX < middleX + xIncrement - buffer) {
            this.setState({ targetX: this.state.targetX + 4 });
        } else {
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
    ) {
        if (video && video instanceof HTMLVideoElement) {
            const image = new Image();

            const canvas = document.createElement('canvas');
            canvas.height = video.height;
            canvas.width = video.width;
            const canvasCtx = canvas.getContext('2d');

            if (canvasCtx) {
                canvasCtx.drawImage(video, 0, 0, video.width, video.height);
                this.analyseLight(image);
            }
        }
    }

    analyseLight(image: HTMLImageElement) {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        const ctx = canvas.getContext('2d');

        if (ctx && canvas.width > 0) {
            ctx.drawImage(image, 0, 0);

            const imageData = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height,
            );

            const data = imageData.data;

            let r = 0;
            let g = 0;
            let b = 0;
            let avg = 0;

            let colorSum = 0;

            for (let i = 0, len = data.length; i < len; i += 4) {
                r = data[i];
                g = data[i + 1];
                b = data[i + 2];

                avg = Math.floor((r + g + b) / 3);
                colorSum += avg;
            }

            const brightness = Math.floor(
                colorSum / (image.width * image.height),
            );

            if (brightness > 175) {
                this.setDilation(pupilSizes.dilated);
            } else if (brightness < 50) {
                this.setDilation(pupilSizes.constricted);
            }
        }
    }

    render() {
        return (
            <div className="App">
                <div className="webcam-feed">
                    {this.state.webcams.map((device, key) => {
                        return (
                            <WebcamFeed
                                key={key}
                                deviceId={device.deviceId}
                                onUserMedia={this.onUserMedia}
                                onUserMediaError={this.onUserMediaError}
                                ref={this.state.videos[key]}
                            />
                        );
                    })}
                </div>

                {this.state.webcams.length > 0 ? (
                    <div className="container">
                        {Object.values(eyes).map((eye, key) => {
                            return (
                                <Eye
                                    class={eye}
                                    key={key}
                                    width={this.state.width / 2}
                                    height={this.state.height}
                                    scleraColor={colours.scleraColor}
                                    irisColor={this.state.userConfig.irisColor}
                                    pupilColor={colours.pupilColor}
                                    scleraRadius={this.state.width / 5}
                                    irisRadius={this.state.width / 10}
                                    pupilRadius={this.state.width / 24}
                                    isBlinking={this.state.isBlinking}
                                    // 1 is neutral eye position; 0 or less is fully closed; larger than 1 makes eye look shocked
                                    openCoefficient={
                                        this.state.eyesDisplayed
                                            ? this.state.eyesOpenCoefficient
                                            : 0
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
                            this.store(configStorageKey, { fps: parseInt(fps) })
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

export default App;
