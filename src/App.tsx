import React from 'react';
import Eye from './components/eye/Eye';
import './App.css';
import { TextBoxMenuItem, CheckBoxMenuItem } from './components/ConfigMenu/MenuItem';
import { ConfigMenu, example } from './components/ConfigMenu/ConfigMenu';

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
}

interface IAppProps {
  environment: Window,
}

class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    //TODO: does not update the dimensions when maximizing or minimazing the window
    // also has problems when opening the dev console
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions() {
    this.setState({
      height: this.props.environment.innerHeight,
      width: this.props.environment.innerWidth,
    });
  }

  render() {
    //return example();
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
      </div>
    );
  }
}

export default App;
