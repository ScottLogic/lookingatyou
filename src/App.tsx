import './App.css';
import React, { RefObject } from 'react';
import * as cocoSSD from "@tensorflow-models/coco-ssd"
import Eye from './components/eye/Eye';
import TextBoxMenuItem from './components/ConfigMenu/TextBoxMenuItem';
import CheckBoxMenuItem from './components/ConfigMenu/CheckBoxMenuItem';
import CanvasMenuItem from './components/ConfigMenu/CanvasMenuItem';
import ColorMenuItem from './components/ConfigMenu/ColorMenuItem';
import { ConfigMenu } from './components/ConfigMenu/ConfigMenu';
import IUserConfig from './components/ConfigMenu/IUserConfig';
import WebcamFeed from './components/webcamFeed/WebcamFeed';
import { videoinput, FPS, eyes, colours, defaultConfigValues, configStorageKey, eyelidPosition, pupilSizes, blinkFrequency, pupilSizeChangeInterval, transitionTime } from './AppConstants';
import './App.css';

interface IAppState {
  width: number,
  height: number,
  webcams: MediaDeviceInfo[],
  eyesDilatedCoefficient: number,
  eyesOpenCoefficient: number,
  webcamAvailable: boolean,
  isBlinking: boolean
  userConfig: IUserConfig
  videos: RefObject<HTMLVideoElement>[],
  targetX: number,
  targetY: number,
  dilationCoefficient: number,
  modelLoaded: boolean
}


interface IAppProps {
  environment: Window
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
      webcamAvailable: false,
      isBlinking: false,
      videos: [],
      targetX: this.props.environment.innerWidth / 4,
      targetY: this.props.environment.innerHeight / 2,
      dilationCoefficient: pupilSizes.neutral,
      userConfig: this.readConfig(configStorageKey) || defaultConfigValues,
      modelLoaded: true
    }

    this.updateDimensions = this.updateDimensions.bind(this);
    this.onUserMedia = this.onUserMedia.bind(this);
    this.onUserMediaError = this.onUserMediaError.bind(this);
    this.detectImage = this.detectImage.bind(this);

    this.leftDebugRef = React.createRef();
    this.rightDebugRef = React.createRef();


    this.props.environment.addEventListener("storage", () => this.readConfig(configStorageKey))
    this.model = null;
    this.frameCapture = 0;
  }

  async componentDidMount() {
    this.props.environment.addEventListener("resize", this.updateDimensions);
    this.getWebcamDevices();

    // Sets up random blinking animation
    this.blink = window.setInterval(() => {
      this.setState((state) => ({
        isBlinking: state.isBlinking ? false : (Math.random() < blinkFrequency / (1000 / transitionTime))
      }));
    }, transitionTime);

    // Sets up cyclical dilation animation
    this.dilate = window.setInterval(() => {
      this.setState((state) => ({
        dilationCoefficient: function () {
          switch (state.dilationCoefficient) {
            case pupilSizes.neutral: return pupilSizes.dilated;
            case pupilSizes.dilated: return pupilSizes.constricted;
            default: return pupilSizes.neutral;
          }
        }()
      }));
    }, pupilSizeChangeInterval);

    this.model = await cocoSSD.load();
    this.setState({modelLoaded : true});
    this.frameCapture = setInterval(this.detectImage, 1000 / FPS, this.state.videos[0].current) as number;
  }

  componentWillUnmount() {
    this.props.environment.removeEventListener("resize", this.updateDimensions);
    clearInterval(this.frameCapture);
    clearInterval(this.blink);
    clearInterval(this.dilate);
  }

  async getWebcamDevices() {
    let devices = await navigator.mediaDevices.enumerateDevices();
    devices = devices.filter(device => device.kind === videoinput);
    this.setState({
      webcams: devices,
      videos: devices.map(() => React.createRef<HTMLVideoElement>())
    });
  }

  updateDimensions() {
    this.setState({
      height: this.props.environment.innerHeight,
      width: this.props.environment.innerWidth,
      targetX: this.props.environment.innerWidth / 4,
      targetY: this.props.environment.innerHeight / 2
    });
  }

  onUserMedia(stream: MediaStream) {
    this.setState({ webcamAvailable: true });
  }


  onUserMediaError() {
    this.setState({ webcamAvailable: false });
  }

  async detectImage(img: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | null) {
    if (this.model && img !== null) {
      var detections = await this.model.detect(img);
      this.selectTarget(detections);
    }
  }

  selectTarget(detections: cocoSSD.DetectedObject[]) {
    var target = detections.find((detection) => detection.class === "person");
    if (target !== undefined) {
      this.calculateEyePos(target.bbox);
    }
  }

  calculateEyePos(bbox: number[]) {
    const [x, y, width, height] = bbox;
    this.setState({
      targetX: x + width / 2,
      targetY: y + height / 2
    })
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
            )
          })}
        </div>

        {this.state.webcams.length > 0 ?
          (
            !(this.state.webcamAvailable && this.state.modelLoaded) ?
              <div className="loading-spinner"></div>
              :
              (
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
                        openCoefficient={this.state.eyesOpenCoefficient}
                        // factor by which to multiply the pupil radius - e.g. 0 is non-existant pupil, 1 is no dilation, 2 is very dilated
                        dilatedCoefficient={this.state.dilationCoefficient}
                        transitionTime={transitionTime.toString()}
                        innerX={this.state.targetX}
                        innerY={this.state.targetY}
                      />
                    )
                  })}
                </div>
              )
          )
          :
          (
            <div className="Error">
              No webcam connected. Please connect a webcam and refresh
            </div>
          )
        }

        <ConfigMenu width="14em" timerLength={1000}>
          <TextBoxMenuItem
            name={"X Sensitivity"}
            defaultValue={`${this.state.userConfig.xSensitivity}`}
            isValidInput={(sens: string) => !isNaN(parseFloat(sens))}
            onValidInput={(sens: string) => this.store(configStorageKey, { xSensitivity: parseFloat(sens) })}
            parse={(text: string) => `${parseFloat(text)}`} />
          <TextBoxMenuItem
            name={"Y Sensitivity"}
            defaultValue={`${this.state.userConfig.ySensitivity}`}
            isValidInput={(sens: string) => !isNaN(parseFloat(sens))}
            onValidInput={(sens: string) => this.store(configStorageKey, { ySensitivity: parseFloat(sens) })}
            parse={(text: string) => `${parseFloat(text)}`} />
          <TextBoxMenuItem
            name={"FPS"}
            defaultValue={`${this.state.userConfig.fps}`}
            isValidInput={(fps: string) => !isNaN(parseInt(fps))}
            onValidInput={(fps: string) => this.store(configStorageKey, { fps: parseInt(fps) })}
            parse={(text: string) => `${parseInt(text)}`} />
          <CheckBoxMenuItem
            name={"Swap Eyes"}
            checked={this.state.userConfig.swapEyes}
            onInputChange={(swapEyes: boolean) => this.store(configStorageKey, { swapEyes })} />
          <CheckBoxMenuItem
            name={"Toggle Debug"}
            checked={this.state.userConfig.toggleDebug}
            onInputChange={(toggleDebug: boolean) => this.store(configStorageKey, { toggleDebug })} />
          <ColorMenuItem
            name={"Iris Color"}
            color={this.state.userConfig.irisColor}
            onInputChange={(irisColor: string) => this.store(configStorageKey, { irisColor })} />
          <CanvasMenuItem
            name={"Left Camera"}
            ref={this.leftDebugRef} />
          <CanvasMenuItem
            name={"Right Camera"}
            ref={this.rightDebugRef} />
        </ConfigMenu>
      </div >
    );
  }

  store(key: string, partialState: Partial<IUserConfig>) {
    var newUserConfig: IUserConfig = {
      ...this.state.userConfig,
      ...partialState
    };
    this.setState({
      userConfig: newUserConfig,
    }, () => {
      var json = JSON.stringify(this.state.userConfig);
      this.props.environment.localStorage.setItem(key, json);
    });
  }

  readConfig(key: string) {
    var json = this.props.environment.localStorage.getItem(key);
    if (json != null)
      return JSON.parse(json);
    else
      return null;
  }
}

export default App;