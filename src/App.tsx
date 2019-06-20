import React from 'react';
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

interface IAppState {
  width: number,
  height: number,
  webcams: MediaDeviceInfo[],
  eyesDilatedCoefficient: number,
  eyesOpenCoefficient: number,
  eyesDisplayed: boolean,
  isBlinking: boolean
}


interface IAppProps {
  environment: Window,
}

class App extends React.Component<IAppProps, IAppState> {
  private leftDebugRef: React.RefObject<CanvasMenuItem>;
  private rightDebugRef: React.RefObject<CanvasMenuItem>;
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      width: this.props.environment.innerWidth,
      height: this.props.environment.innerHeight,
      webcams: [],
      eyesDilatedCoefficient: 1,
      eyesOpenCoefficient: eyelids.CLOSED,
      eyesDisplayed: false,
      isBlinking: false
    }

    this.updateDimensions = this.updateDimensions.bind(this);
    this.onUserMedia = this.onUserMedia.bind(this);
    this.onUserMediaError = this.onUserMediaError.bind(this);
    this.leftDebugRef = React.createRef();
    this.rightDebugRef = React.createRef();


  }

  componentDidMount() {
    this.props.environment.addEventListener("resize", this.updateDimensions);
    this.getWebcamDevices();
    window.setInterval(() => {
      this.setState((state) => ({
        isBlinking: state.isBlinking ? false : (Math.random() < eyelids.BLINKFREQUENCY / (1000/transitionTime))
      }));
    }, transitionTime);
  }

  componentWillUnmount() {
    this.props.environment.removeEventListener("resize", this.updateDimensions);
  }

  async getWebcamDevices() {
    let devices = await navigator.mediaDevices.enumerateDevices();
    devices = devices.filter(device => device.kind === videoinput);
    this.setState({
      webcams: devices,
    });
  }

  updateDimensions() {
    this.setState({
      height: this.props.environment.innerHeight,
      width: this.props.environment.innerWidth,
    });
  }

  onUserMedia(stream: MediaStream) {
    this.setState({ eyesDisplayed: true, eyesOpenCoefficient: eyelids.OPEN });
  }

  onUserMediaError() {
    this.setState({ eyesDisplayed: false, eyesOpenCoefficient: eyelids.CLOSED });
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
