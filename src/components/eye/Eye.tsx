import React from 'react';

interface IEyeProps {
  class: string;
  width: number;
  height: number;
  scleraColor: string;
  irisColor: string;
  pupilColor: string;
  innerX: number;
  innerY: number;
}

interface IEyeState {
  scleraSize: number;
  irisSize: number;
  pupilSize: number;
}

export default class Eye extends React.Component<IEyeProps, IEyeState> {
  constructor(props: IEyeProps) {
    super(props);

    this.state = {
      scleraSize: 4,
      irisSize: 8,
      pupilSize: 16,
    };
  }

  public render() {
    return (
      <svg
        className={this.props.class}
        width={this.props.width}
        height={this.props.height}
      >
        {this.renderCircle(
          this.props.width / this.state.scleraSize,
          'sclera',
          this.props.scleraColor,
        )}
        <g className="inner">
          {this.renderCircle(
            this.props.width / this.state.irisSize,
            'iris',
            this.props.irisColor,
            this.props.innerX,
            this.props.innerY,
          )}
          {this.renderCircle(
            this.props.width / this.state.pupilSize,
            'pupil',
            this.props.pupilColor,
            this.props.innerX,
            this.props.innerY,
          )}
        </g>
      </svg>
    );
  }

  private renderCircle(
    radius: number,
    name: string,
    colour: string,
    centerX: number = this.props.width / 2,
    centerY: number = this.props.height / 2,
  ) {
    return (
      <circle
        r={radius}
        className={name}
        fill={colour}
        cx={centerX}
        cy={centerY}
      />
    );
  }
}
