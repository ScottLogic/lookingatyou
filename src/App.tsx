import './App.css';
import React, { RefObject } from 'react';
import * as cocoSSD from "@tensorflow-models/coco-ssd"
import Eye from './components/eye/Eye';
import TextBoxMenuItem from './components/ConfigMenu/TextBoxMenuItem';
import CheckBoxMenuItem from './components/ConfigMenu/CheckBoxMenuItem';
import CanvasMenuItem from './components/ConfigMenu/CanvasMenuItem';
import ColorMenuItem from './components/ConfigMenu/ColorMenuItem';
import { ConfigMenu } from './components/ConfigMenu/ConfigMenu';
<<<<<<< HEAD
import IUserConfig from './components/ConfigMenu/IUserConfig';
import WebcamFeed from './components/webcamFeed/WebcamFeed';
<<<<<<< HEAD
import { videoinput, FPS, eyes, colours, defaultConfigValues, configStorageKey, eyelidPosition, pupilSizes, blinkFrequency, pupilSizeChangeInterval, transitionTime } from './AppConstants';
import './App.css';
=======
=======
import './App.css';
>>>>>>> refactored WebcamFeed to use global video store
import configureStream from './components/webcamHandler/WebcamHandler';
import { IRootStore } from './store/reducers/rootReducer';
import { getDeviceIds } from './store/selectors/videoSelectors';
import { connect } from 'react-redux';
import Video from './components/video/Video';

const eyes = {
  LEFT: 'left',
  RIGHT: 'right',
}

const colours = {
  scleraColor: "white",
  irisColor: "lightBlue",
  pupilColor: "black"
}

<<<<<<< HEAD
const videoinput = 'videoinput';
>>>>>>> refactor for webcam handler and multiple webcams

=======
>>>>>>> refactored WebcamFeed to use global video store
interface IAppState {
  width: number,
  height: number,
  webcams: MediaDeviceInfo[],
  eyesDilatedCoefficient: number,
  eyesOpenCoefficient: number,
  eyesDisplayed: boolean,
  isBlinking: boolean
  userConfig: IUserConfig
  videos: RefObject<HTMLVideoElement>[],
  targetX: number,
  targetY: number,
  dilationCoefficient: number
}


interface IAppProps {
  environment: Window
}

interface IAppMapStateToProps {
  deviceIds: string[]
}

type AppProps = IAppProps &  IAppMapStateToProps;

const mapStateToProps = (state: IRootStore) => {
  return {
    deviceIds: getDeviceIds(state)
  }
}

class App extends React.Component<AppProps, IAppState> {
  private leftDebugRef: React.RefObject<CanvasMenuItem>;
  private rightDebugRef: React.RefObject<CanvasMenuItem>;
<<<<<<< HEAD
  private model: cocoSSD.ObjectDetection | null;
  private frameCapture: number;
  private blink: number = 0;
  private dilate: number = 0;
  constructor(props: IAppProps) {
=======
  constructor(props: AppProps) {
>>>>>>> refactor for webcam handler and multiple webcams
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
      dilationCoefficient: pupilSizes.neutral,
      userConfig: this.readConfig(configStorageKey) || defaultConfigValues,
    }

    this.updateDimensions = this.updateDimensions.bind(this);
    this.onUserMedia = this.onUserMedia.bind(this);
<<<<<<< HEAD
<<<<<<< HEAD
    this.onUserMediaError = this.onUserMediaError.bind(this);
    this.detectImage = this.detectImage.bind(this);

=======
>>>>>>> refactored WebcamFeed to use global video store
=======
    this.onUserMediaError = this.onUserMediaError.bind(this);
>>>>>>> clean up
    this.leftDebugRef = React.createRef();
    this.rightDebugRef = React.createRef();


    this.props.environment.addEventListener("storage", () => this.readConfig(configStorageKey))
    this.model = null;
    this.frameCapture = 0;
  }

<<<<<<< HEAD
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
    this.frameCapture = setInterval(this.detectImage, 1000 / FPS, this.state.videos[0].current) as number;
=======
  componentDidMount() {
<<<<<<< HEAD
<<<<<<< HEAD
    configureStream(this.props.environment.navigator.mediaDevices);
>>>>>>> refactor for webcam handler and multiple webcams
=======
    configureStream(this.props.environment.navigator.mediaDevices, this.onUserMedia);
>>>>>>> refactored WebcamFeed to use global video store
=======
    configureStream(this.props.environment.navigator.mediaDevices, this.onUserMedia, this.onUserMediaError);
    this.props.environment.navigator.mediaDevices.ondevicechange = () => configureStream(this.props.environment.navigator.mediaDevices, this.onUserMedia, this.onUserMediaError);
>>>>>>> clean up
  }

  componentWillUnmount() {
    this.props.environment.removeEventListener("resize", this.updateDimensions);
    clearInterval(this.frameCapture);
    clearInterval(this.blink);
    clearInterval(this.dilate);
  }

<<<<<<< HEAD
  async getWebcamDevices() {
    let devices = await navigator.mediaDevices.enumerateDevices();
    devices = devices.filter(device => device.kind === videoinput);
    this.setState({
      webcams: devices,
      videos: devices.map(() => React.createRef<HTMLVideoElement>())
    });
  }

=======
>>>>>>> refactored WebcamFeed to use global video store
  updateDimensions() {
    this.setState({
      height: this.props.environment.innerHeight,
      width: this.props.environment.innerWidth,
      targetX: this.props.environment.innerWidth / 4,
      targetY: this.props.environment.innerHeight / 2
    });
  }

<<<<<<< HEAD
  onUserMedia(stream: MediaStream) {
    this.setState({ eyesDisplayed: true, eyesOpenCoefficient: eyelidPosition.OPEN });
  }


  onUserMediaError() {
    this.setState({ eyesDisplayed: false, eyesOpenCoefficient: eyelidPosition.CLOSED });
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

=======
  onUserMedia() {
    this.setState({ eyesDisplayed: true });
  }

<<<<<<< HEAD
>>>>>>> refactored WebcamFeed to use global video store
=======
  onUserMediaError() {
    this.setState({ eyesDisplayed: false });
  }

>>>>>>> clean up
  render() {
    return (
      <div className="App">
        <div className="webcam-feed">
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
          {this.props.deviceIds.map((device, key) => {
            return (<WebcamFeed key={key} deviceId={device} />)
>>>>>>> refactor for webcam handler and multiple webcams
          })}
=======
          {this.props.deviceIds.map((device, key) =>
            <Video key={key} deviceId={device} />
          )}
>>>>>>> refactored WebcamFeed to use global video store
        </div>

        {this.state.webcams.length > 0 ?
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
                  openCoefficient={this.state.eyesDisplayed ? this.state.eyesOpenCoefficient : 0}
                  // factor by which to multiply the pupil radius - e.g. 0 is non-existant pupil, 1 is no dilation, 2 is very dilated
                  dilatedCoefficient={this.state.dilationCoefficient}
                  transitionTime={transitionTime.toString()}
                  innerX={this.state.targetX}
                  innerY={this.state.targetY}
                />
              )
            })}
          </div>
          :
          <div className="Error">
            No webcam connected. Please connect a webcam and refresh
          </div>
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

<<<<<<< HEAD
export default App;
=======
export default connect(mapStateToProps)(App);
>>>>>>> refactor for webcam handler and multiple webcams
