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

interface configDict { [Key: string]: any }

const defaultConfigValues: configDict = {
  "X Sensitivity": 1,
  "Y Sensitivity": 1,
  "FPS": 5,
  "Swap Eyes": false,
  "Toggle Debug": false,
  "Iris Color": colours.irisColor,
}


const videoinput = 'videoinput';

interface IAppState {
  width: number,
  height: number,
  eyesDisplayed: boolean,
  webcams: MediaDeviceInfo[],
  configValues: configDict
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
      configValues: defaultConfigValues
    }

    this.updateDimensions = this.updateDimensions.bind(this);
    this.onUserMedia = this.onUserMedia.bind(this);
    this.onUserMediaError = this.onUserMediaError.bind(this);
    this.leftDebugRef = React.createRef();
    this.rightDebugRef = React.createRef();
  }

  componentDidMount() {
    this.props.environment.addEventListener("resize", this.updateDimensions);
    this.readConfig();
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
                    irisColor={this.state.configValues["Iris Color"]}
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

        <ConfigMenu width="14em" timerLength={2000}>
          <TextBoxMenuItem
            name={"X Sensitivity"}
            value={this.state.configValues["X Sensitivity"]}
            onInputChange={(sens: string) => {
              if (parseInt(sens))
                this.store("X Sensitivity", parseInt(sens));
            }} />
          <TextBoxMenuItem
            name={"Y Sensitivity"}
            value={this.state.configValues["Y Sensitivity"]}
            onInputChange={(sens: string) => {
              if (parseInt(sens))
                this.store("Y Sensitivity", parseInt(sens));
            }} />
          <TextBoxMenuItem
            name={"FPS"}
            value={this.state.configValues["FPS"]}
            onInputChange={(fps: string) => {
              if (parseInt(fps))
                this.store("FPS", parseInt(fps));
            }} />
          <CheckBoxMenuItem
            name={"Swap Eyes"}
            checked={this.state.configValues["Swap Eyes"]}
            onInputChange={(checked: boolean) => {
              this.store("Swap Eyes", checked);
            }} />
          <CheckBoxMenuItem
            name={"Toggle Debug"}
            checked={this.state.configValues["Toggle Debug"]}
            onInputChange={(checked: boolean) => {
              this.store("Toggle Debug", checked);
            }} />
          <ColorMenuItem
            name={"Iris Color"}
            color={this.state.configValues["Iris Color"]}
            onInputChange={(color: string) => {
              this.store("Iris Color", color);
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
  store(item: string, val: any) {
    var configValuesCopy: configDict = {};
    Object.assign(configValuesCopy, this.state.configValues);
    configValuesCopy[item] = val;
    this.setState({
      configValues: configValuesCopy,
    }, () => {
      var json = JSON.stringify(this.state.configValues);
      this.props.environment.localStorage.setItem("config", json);
    });
  }

  readConfig() {
    var json = this.props.environment.localStorage.getItem("config");
    if (json === "undefined" || json == null) {
      console.log("Config in local storage");
    } else {
      var newConfigValues = this.state.configValues
      try {
        newConfigValues = JSON.parse(json);
      } catch (e) {
        if (e instanceof SyntaxError)
          console.log("Malformed JSON Config\n", e);
        else
          throw e;
      }
      finally {
        for (const [key] of Object.entries(defaultConfigValues))
          if (typeof newConfigValues[key] != typeof defaultConfigValues[key]) {
            console.log(`Error: ${newConfigValues[key]}:${typeof newConfigValues[key]} found in place of val:${typeof defaultConfigValues[key]} in config in local storage. Using default value ${defaultConfigValues[key]}, instead.`);
            newConfigValues[key] = defaultConfigValues[key];
          }
        this.setState({ configValues: newConfigValues });
      }
    }
  }
}

export default App;