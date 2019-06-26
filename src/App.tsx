/* tslint:disable: jsx-no-lambda radix only-arrow-functions */

import * as cocoSSD from '@tensorflow-models/coco-ssd';
import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import './App.css';
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
    userConfig: IUserConfig;
    targetX: number;
    targetY: number;
    dilationCoefficient: number;
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
            targetX: this.props.environment.innerWidth / 4,
            targetY: this.props.environment.innerHeight / 2,
            dilationCoefficient: pupilSizes.neutral,
            userConfig:
                this.readConfig(configStorageKey) || defaultConfigValues,
            modelLoaded: true,
        };

        this.updateDimensions = this.updateDimensions.bind(this);
        this.onUserMedia = this.onUserMedia.bind(this);
        this.onUserMediaError = this.onUserMediaError.bind(this);
        this.detectImage = this.detectImage.bind(this);
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

        this.dilate = window.setInterval(() => {
            this.setState(state => ({
                dilationCoefficient: (function() {
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
        }, pupilSizeChangeInterval);

        this.model = await cocoSSD.load();
        if (this.props.videos[0]) {
            this.frameCapture = setInterval(
                this.detectImage,
                1000 / FPS,
                this.props.videos[0],
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
        const [x, y, width, height] = bbox;
        this.setState({
            targetX: x + width / 2,
            targetY: y + height / 2,
        });
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

export default connect(mapStateToProps)(App);
