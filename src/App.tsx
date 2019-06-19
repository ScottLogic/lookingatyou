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

const colours = {
  scleraColor: "white",
  irisColor: "lightBlue",
  pupilColor: "black"
}

const videoinput = 'videoinput';

interface IAppState {
  width: number,
  height: number,
  eyesDisplayed: boolean,
  webcams: MediaDeviceInfo[],
  eyes: { dilation: number, closed: number }
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
      eyesDisplayed: false,
      webcams: [],
      eyes: { dilation: 0, closed: 0 }
    }

    this.updateDimensions = this.updateDimensions.bind(this);
    this.onUserMedia = this.onUserMedia.bind(this);
    this.onUserMediaError = this.onUserMediaError.bind(this);
    this.leftDebugRef = React.createRef();
    this.rightDebugRef = React.createRef();
    window.setInterval(() => {
      this.setState((state) => ({
        eyes: { dilation: state.eyes.dilation, closed: 1 - state.eyes.closed }
      }))
    }, 1500);

  }

  componentDidMount() {
    this.props.environment.addEventListener("resize", this.updateDimensions);
    this.getWebcamDevices();
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
    this.setState({ eyesDisplayed: true });
  }

  onUserMediaError() {
    this.setState({ eyesDisplayed: false });
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
                    irisColor={colours.irisColor}
                    pupilColor={colours.pupilColor}
                    scleraRadius={this.state.width / 8}
                    irisRadius={this.state.width / 16}
                    pupilRadius={this.state.width / 40}
                    closedFactor={this.state.eyes.closed}
                    dilationFactor={this.state.eyes.dilation}
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
