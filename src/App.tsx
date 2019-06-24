import React, { RefObject } from 'react';
import * as cocoSSD from "@tensorflow-models/coco-ssd"

import Eye from './components/eye/Eye';
import { TextBoxMenuItem, CheckBoxMenuItem, CanvasMenuItem } from './components/ConfigMenu/MenuItem';
import { ConfigMenu } from './components/ConfigMenu/ConfigMenu';
import WebcamFeed from './components/webcamFeed/WebcamFeed';
import './App.css';


const eyes = {
  LEFT: 'left',
  RIGHT: 'right',
}

const eyelids = {
  OPEN: 0.5,
  CLOSED: 0,
  SHOCKED: 0.75,
  BLINKFREQUENCY: 0.25,
}

const transitionTime = 100; // for animating eyelids and pupils

const colours = {
  scleraColor: "white",
  irisColor: "darkGoldenrod",
  pupilColor: "black"
}

const videoinput = 'videoinput';

const FPS = 30;

interface IAppState {
  width: number,
  height: number,
  webcams: MediaDeviceInfo[],
  eyesDilatedCoefficient: number,
  eyesOpenCoefficient: number,
  eyesDisplayed: boolean,
  isBlinking: boolean
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
      webcams: [],
      eyesDilatedCoefficient: 1,
      eyesOpenCoefficient: eyelids.CLOSED,
      eyesDisplayed: false,
      isBlinking: false,
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
    window.setInterval(() => {
      this.setState((state) => ({
        isBlinking: state.isBlinking ? false : (Math.random() < eyelids.BLINKFREQUENCY / (1000/transitionTime))
      }));
    }, transitionTime);
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
    this.setState({ eyesDisplayed: true, eyesOpenCoefficient: eyelids.OPEN });
  }


  onUserMediaError() {
    this.setState({ eyesDisplayed: false, eyesOpenCoefficient: eyelids.CLOSED });
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
                  irisColor={colours.irisColor}
                  pupilColor={colours.pupilColor}
                  scleraRadius={this.state.width / 5}
                  irisRadius={this.state.width / 10}
                  pupilRadius={this.state.width / 24}
                  isBlinking={this.state.isBlinking}
                  // 1 is neutral eye position; 0 or less is fully closed; larger than 1 makes eye look shocked
                  openCoefficient={this.state.eyesDisplayed ? this.state.eyesOpenCoefficient : 0}
                  // factor by which to multiply the pupil radius - e.g. 0 is non-existant pupil, 1 is no dilation, 2 is very dilated
                  dilatedCoefficient={this.state.eyesDilatedCoefficient}
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
