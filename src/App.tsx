import React, { RefObject } from 'react';
import * as cocoSSD from "@tensorflow-models/coco-ssd"

import Eye from './components/eye/Eye';
import { TextBoxMenuItem, CheckBoxMenuItem, CanvasMenuItem } from './components/ConfigMenu/MenuItem';
import { ConfigMenu } from './components/ConfigMenu/ConfigMenu';
import './App.css';
import WebcamFeed from './components/webcamFeed/WebcamFeed';

const eyes = {
  LEFT: 'left',
  RIGHT: 'right',
}

const colours = {
  scleraColor: "white",
  irisColor: "lightBlue",
  pupilColor: "black"
}

const videoinput = 'videoinput';

const FPS = 30;

interface IAppState {
  width: number,
  height: number,
  eyesDisplayed: boolean,
  webcams: MediaDeviceInfo[],
  videos: RefObject<HTMLVideoElement>[],
  targetX: number,
  targetY: number,
}

interface IAppProps {
  environment: Window,
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
    this.model = null;
    this.frameCapture = 0;
  }

  async componentDidMount() {
    this.props.environment.addEventListener("resize", this.updateDimensions);
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
      videos: Array(devices.length).fill(undefined).map( () => React.createRef())
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

  async detectImage(img : ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|null)
  {
    if (this.model && img !== null){
      var detections = await this.model.detect(img);
      this.selectTarget(detections);
    }
  }
  
  selectTarget(detections : cocoSSD.DetectedObject[])
  {
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
                    {...colours}
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
            default={localStorage.getItem("X Sensitivity") || "1"}
            onInputChange={(text: string) => { }} />
          <TextBoxMenuItem
            name={"Y Sensitivity"}
            default={localStorage.getItem("Y Sensitivity") || "1"}
            onInputChange={(text: string) => { }} />
          <TextBoxMenuItem
            name={"FPS"}
            default={localStorage.getItem("FPS") || "5"}
            onInputChange={(text: string) => { }} />
          <CheckBoxMenuItem
            name={"Swap Eyes"}
            default={"true" === (localStorage.getItem("Swap Eyes"))}
            onInputChange={(checked: boolean) => { }} />
          <CheckBoxMenuItem
            name={"Toggle Debug"}
            default={"true" === (localStorage.getItem("Toggle Debug"))}
            onInputChange={(checked: boolean) => { }} />
          <CanvasMenuItem
            name={"Left Camera"}
            ref={this.leftDebugRef} />
          <CanvasMenuItem
            name={"Right Camera"}
            ref={this.rightDebugRef} />
        </ConfigMenu>
      </div>
    );
  }
}

export default App;
