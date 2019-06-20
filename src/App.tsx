import React from 'react';
import Eye from './components/eye/Eye';
import { TextBoxMenuItem, CheckBoxMenuItem, ColorMenuItem, CanvasMenuItem } from './components/ConfigMenu/MenuItem';
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


const videoinput = 'videoinput';

interface IAppState {
  width: number,
  height: number,
  eyesDisplayed: boolean,
  webcams: MediaDeviceInfo[],
  irisColor: string
}

interface IAppProps {
  environment: Window
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
      irisColor: colours.irisColor,
    }

    this.updateDimensions = this.updateDimensions.bind(this);
    this.onUserMedia = this.onUserMedia.bind(this);
    this.onUserMediaError = this.onUserMediaError.bind(this);
    this.leftDebugRef = React.createRef();
    this.rightDebugRef = React.createRef();

    var originalSetItem = this.props.environment.localStorage.setItem;
    this.props.environment.localStorage.setItem = function(key : string, value : any) {
      document.createEvent('Event').initEvent('itemInserted', true, true);
      originalSetItem.apply(key, value);
    }
  }

  componentDidMount() {
    this.props.environment.addEventListener("resize", this.updateDimensions);
    this.getWebcamDevices();
    this.setState((state) => ({
      irisColor: this.storedOrDefault("Iris Color", state.irisColor)
    }));
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
                    irisColor={this.state.irisColor}
                    pupilColor={colours.pupilColor}
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
            default={this.storedOrDefault("X Sensitivity", "1")}
            onInputChange={(sens: string) => {
              this.store("X Sensitivity", sens);
            }} />
          <TextBoxMenuItem
            name={"Y Sensitivity"}
            default={this.storedOrDefault("Y Sensitivity", "1")}
            onInputChange={(sens: string) => {
              this.store("Y Sensitivity", sens);
            }} />
          <TextBoxMenuItem
            name={"FPS"}
            default={this.storedOrDefault("FPS", "5")}
            onInputChange={(fps: string) => {
              this.store("FPS", fps);
            }} />
          <CheckBoxMenuItem
            name={"Swap Eyes"}
            default={this.storedOrDefault("Swap Eyes", "false")}
            onInputChange={(checked: boolean) => {
              this.store("Swap Eyes", checked.toString());
            }} />
          <CheckBoxMenuItem
            name={"Toggle Debug"}
            default={this.storedOrDefault("Toggle Debug", "false")}
            onInputChange={(checked: boolean) => {
              this.store("Toggle Debug", checked.toString());
            }} />
          <ColorMenuItem
            name={"Iris Color"}
            default={this.storedOrDefault("Iris Color", colours.irisColor)}
            onInputChange={(color: string) => {
              this.store("Iris Color", color); this.setState({ irisColor: color });
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
  storedOrDefault(item: string, def: string) : any {
    var json = this.props.environment.localStorage.getItem(item) || def;
    var val = JSON.parse(json);
    return val;
  }
  store(item: string, val: any) {
    var json = JSON.stringify(val);
    this.props.environment.localStorage.setItem(item, json);
  }
}


export default App;
