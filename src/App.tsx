import React from 'react';
import Eye from './components/eye/Eye';
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

interface IAppState {
  width: number,
  height: number,
  eyesDisplayed: boolean,
  webcams: MediaDeviceInfo[],
}

interface IAppProps {
  environment: Window,
}

class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      width: this.props.environment.innerWidth,
      height: this.props.environment.innerHeight,
      eyesDisplayed: false,
      webcams: [],
    }

    this.updateDimensions = this.updateDimensions.bind(this);
    this.onUserMedia = this.onUserMedia.bind(this);
    this.onUserMediaError = this.onUserMediaError.bind(this);
  }

  componentDidMount() {
    this.props.environment.addEventListener("resize", this.updateDimensions);
    this.getWebcamDevices();
  }

  componentWillUnmount() {
    this.props.environment.removeEventListener("resize", this.updateDimensions);
  }

  async getWebcamDevices() {
    let devices = await navigator.mediaDevices.enumerateDevices()
    devices = devices.filter(device => {
      if (device.kind === videoinput) {
        return device;
      }
    });
    this.setState({
      webcams: devices
    })
  }

  updateDimensions() {
    this.setState({
      height: this.props.environment.innerHeight,
      width: this.props.environment.innerWidth,
    });
  }

  onUserMedia(stream: MediaStream) {
    this.setState({ eyesDisplayed: true });
    return
  }

  onUserMediaError() {
    this.setState({ eyesDisplayed: false })
    console.log('error');
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
        <div className={this.state.eyesDisplayed ? 'container' : 'hidden'}>
          {Object.values(eyes).map((eye, key) => {
            return (
              <Eye
                class={eye}
                key={key}
                width={this.state.width / 2}
                height={this.state.height}
                {...colours}
              />
            )
          })}
        </div>
      </div>
    );
  }
}

export default App;
