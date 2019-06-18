import React from 'react';
import Eye from './components/eye/Eye';
import { TextBoxMenuItem, CheckBoxMenuItem } from './components/ConfigMenu/MenuItem';
import { ConfigMenu, Example } from './components/ConfigMenu/ConfigMenu';
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
    }

    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    this.props.environment.addEventListener("resize", this.updateDimensions);
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
        <Example/>>
      </div>
    );
  }
}

export default App;