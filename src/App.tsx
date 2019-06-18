import React from 'react';
import Eye from './components/eye/Eye';
import { TextBoxMenuItem, CheckBoxMenuItem, CanvasMenuItem } from './components/ConfigMenu/MenuItem';
import { ConfigMenu } from './components/ConfigMenu/ConfigMenu';
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

interface IAppState {
  width: number,
  height: number,
  leftDebugRef: React.RefObject<CanvasMenuItem>,
  rightDebugRef: React.RefObject<CanvasMenuItem>,
}

interface IAppProps {
  environment: Window,
}

class App extends React.Component<IAppProps, IAppState> {
  private leftDebugRef: React.RefObject<CanvasMenuItem>;
  private rightDebugRef: React.RefObject<CanvasMenuItem>;
  private isLoading: boolean = false;
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      leftDebugRef: React.createRef(),
      rightDebugRef: React.createRef(),
      width: this.props.environment.innerWidth,
      height: this.props.environment.innerHeight
    }

    this.updateDimensions = this.updateDimensions.bind(this);

    this.leftDebugRef = React.createRef();
    this.rightDebugRef = React.createRef();
  }

  componentDidMount() {
    this.props.environment.addEventListener("resize", this.updateDimensions);
    if (this.isLoading)
      return;

    // Testing drawing on canvas
    var that: App = this;
    var img: HTMLImageElement = new Image();
    img.src = "https://www.w3schools.com/howto/img_forest.jpg";
    img.onload = function () {
      that.leftDebugRef.current!.drawImage(img, { x: 5, y: 5, width: 200, height: 100 });
      that.rightDebugRef.current!.drawImage(img);
    }

  }

  componentWillUnmount() {
    this.props.environment.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions() {
    this.setState({
      height: this.props.environment.innerHeight,
      width: this.props.environment.innerWidth,
    });
  }

  render() {
    if (this.isLoading)
      return (<div className={"loading-spinner"}></div>)
    else
      return (
        <div className="App">
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
          <ConfigMenu width="14em" timerLength={1000}>
            <TextBoxMenuItem
              name={"X Sensitivity"}
              default={localStorage.getItem("X Sensitivity") || "2"}
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
              default={"true" === (localStorage.getItem("Swap Eyes" || "false"))}
              onInputChange={(checked: boolean) => { }} />
            <CheckBoxMenuItem
              name={"Toggle Debug"}
              default={"true" === (localStorage.getItem("Toggle Debug" || "false"))}
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
