import React, { RefObject } from 'react';
import * as cocoSSD from "@tensorflow-models/coco-ssd"

import Eye from './components/eye/Eye';
import TextBoxMenuItem from './components/ConfigMenu/TextBoxMenuItem';
import CheckBoxMenuItem from './components/ConfigMenu/CheckBoxMenuItem';
import CanvasMenuItem from './components/ConfigMenu/CanvasMenuItem';
import ColorMenuItem from './components/ConfigMenu/ColorMenuItem';
import { ConfigMenu } from './components/ConfigMenu/ConfigMenu';
import './App.css';
import WebcamFeed from './components/webcamFeed/WebcamFeed';

const eyes = {
  LEFT: 'left',
  RIGHT: 'right',
}

const colours = {
  scleraColor: "white",
  irisColor: "#ff8080", // must be hex value, as this is passed to colour picker input
  pupilColor: "black"
}

interface configDict { [Key: string]: any }

const defaultConfigValues: configDict = {
  "X Sensitivity": "1.0",
  "Y Sensitivity": "1.0",
  "FPS": "5",
  "Swap Eyes": false,
  "Toggle Debug": false,
  "Iris Color": colours.irisColor,
}

const videoinput = 'videoinput';

const FPS = 30;

interface IAppState {
  width: number,
  height: number,
  eyesDisplayed: boolean,
  webcams: MediaDeviceInfo[],
  configValues: configDict
  videos: RefObject<HTMLVideoElement>[],
  targetX: number,
  targetY: number,
}

interface IAppProps {
  environment: Window
}

class App extends React.Component<IAppProps, IAppState> {
  private leftDebugRef: React.RefObject<CanvasMenuItem>;
  private rightDebugRef: React.RefObject<CanvasMenuItem>;
  private model: cocoSSD.ObjectDetection | null;
  private frameCapture: number;
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      width: this.props.environment.innerWidth,
      height: this.props.environment.innerHeight,
      eyesDisplayed: false,
      webcams: [],
      configValues: defaultConfigValues,
      videos: [],
      targetX: this.props.environment.innerWidth/4,
      targetY: this.props.environment.innerHeight/2
    }

    this.updateDimensions = this.updateDimensions.bind(this);
    this.onUserMedia = this.onUserMedia.bind(this);
    this.onUserMediaError = this.onUserMediaError.bind(this);
    this.detectImage = this.detectImage.bind(this);
    this.leftDebugRef = React.createRef();
    this.rightDebugRef = React.createRef();

    this.props.environment.addEventListener("storage", () => this.readConfig("config", this.props.environment.localStorage))
    this.model = null;
    this.frameCapture = 0;
  }

  async componentDidMount() {
    this.props.environment.addEventListener("resize", this.updateDimensions);
    this.readConfig("config", this.props.environment.localStorage);
    this.getWebcamDevices();
    this.model = await cocoSSD.load();
    this.frameCapture = setInterval(this.detectImage, 1000/FPS, this.state.videos[0].current) as number;
  }

  componentWillUnmount() {
    this.props.environment.removeEventListener("resize", this.updateDimensions);
    clearInterval(this.frameCapture);
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
      targetX: this.props.environment.innerWidth/4,
      targetY: this.props.environment.innerHeight/2
    });
  }

  onUserMedia(stream: MediaStream) {
    this.setState({ eyesDisplayed: true });
  }

  onUserMediaError(error: Error) {
    this.setState({ eyesDisplayed: false });
  }

  async detectImage(img : ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|null) {
    if (this.model && img !== null){
      var detections = await this.model.detect(img);
      this.selectTarget(detections);
    }
  }
  
  selectTarget(detections : cocoSSD.DetectedObject[]){
    var target = detections.find( (detection) => detection.class === "person");
    if (target !== undefined) {
      this.calculateEyePos(target.bbox);
    }
  }

  calculateEyePos(bbox : number[]) {
    const [x, y, width, height] = bbox;
    this.setState({
      targetX: x + width/2, 
      targetY: y + height/2
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

        {this.state.eyesDisplayed ?
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
                    irisColor={this.state.configValues["Iris Color"]}
                    pupilColor={colours.pupilColor}
                    innerX={this.state.targetX}
                    innerY={this.state.targetY}
                  />
                )
              })}
            </div>
          )
          :
          (
            this.state.webcams.length > 0 ?
              <div className="loading-spinner"></div>
              :
              <div className="Error">
                No webcam connected. Please connect a webcam and refresh
              </div>
          )
        }

        <ConfigMenu width="14em" timerLength={1000}>
          <TextBoxMenuItem
            name={"X Sensitivity"}
            value={this.state.configValues["X Sensitivity"]}
            onInputChange={(sens: string) => {
              this.store("X Sensitivity", sens, this.props.environment.localStorage);
            }} />
          <TextBoxMenuItem
            name={"Y Sensitivity"}
            value={this.state.configValues["Y Sensitivity"]}
            onInputChange={(sens: string) => {
              this.store("Y Sensitivity", sens, this.props.environment.localStorage);
            }} />
          <TextBoxMenuItem
            name={"FPS"}
            value={this.state.configValues["FPS"]}
            onInputChange={(fps: string) => {
              this.store("FPS", fps, this.props.environment.localStorage);
            }} />
          <CheckBoxMenuItem
            name={"Swap Eyes"}
            checked={this.state.configValues["Swap Eyes"]}
            onInputChange={(checked: boolean) => {
              this.store("Swap Eyes", checked, this.props.environment.localStorage);
            }} />
          <CheckBoxMenuItem
            name={"Toggle Debug"}
            checked={this.state.configValues["Toggle Debug"]}
            onInputChange={(checked: boolean) => {
              this.store("Toggle Debug", checked, this.props.environment.localStorage);
            }} />
          <ColorMenuItem
            name={"Iris Color"}
            color={this.state.configValues["Iris Color"]}
            onInputChange={(color: string) => {
              this.store("Iris Color", color, this.props.environment.localStorage);
            }} />
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
  
  store(itemKey: string, itemVal: any, storage: Storage) {
    var configValuesCopy: configDict = {};
    Object.assign(configValuesCopy, this.state.configValues);
    configValuesCopy[itemKey] = itemVal;
    this.setState({
      configValues: configValuesCopy,
    }, () => {
      var json = JSON.stringify(this.state.configValues);
      storage.setItem("config", json);
    });
  }

  readConfig(configKey: string, storage: Storage) {
    var json = storage.getItem(configKey);
    if (json != null)
      this.setState({ configValues: JSON.parse(json) });
  }
}

export default App;