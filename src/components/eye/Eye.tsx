import React from 'react';
import './Eye.css';

interface IEyeProps {
    class: string,
    width: number,
    height: number,
    scleraColor: string,
    irisColor: string,
    pupilColor: string,
    scleraRadius: number,
    irisRadius: number,
    pupilRadius: number,
    closedCoefficient: number,
    dilatedCoefficient: number,
    animationTime: string
}

export default class Eye extends React.Component<IEyeProps> {
    constructor(props: IEyeProps) {
        super(props);
    }

    renderCircle(radius: number, name: string, colour: string) {
        return (
            <circle
                r={radius}
                className={name}
                fill={colour}
                cx="50%"
                cy="50%"
            />
        )
    }

    render() {
        var xMiddle = this.props.width / 2;
        var xLeft = xMiddle - this.props.scleraRadius
        var xRight = xMiddle + this.props.scleraRadius;
        var yMiddle = this.props.height / 2;
        return (
            <svg className={this.props.class} width={this.props.width} height={this.props.height} >
                {this.renderCircle(this.props.scleraRadius, "sclera", this.props.scleraColor)}
                <g className="inner">
                    {this.renderCircle(this.props.irisRadius, "iris", this.props.irisColor)}
                    {this.renderCircle(this.props.pupilRadius * (1 + this.props.dilatedCoefficient), "pupil", this.props.pupilColor)}
                </g>
                <svg className = "Eyelid">
                    <path d={
                        `M ${xLeft} ${yMiddle} ` +
                        `A ${this.props.scleraRadius} ${this.props.scleraRadius} 0 0 1 ${xRight} ${yMiddle} ` +
                        `Q ${xMiddle} ${yMiddle - this.props.scleraRadius * (1 - this.props.closedCoefficient)}, ${xLeft} ${yMiddle}`
                    }>
                    </path>
                    <path d={
                        `M ${xLeft} ${yMiddle} ` +
                        `A ${this.props.scleraRadius} ${this.props.scleraRadius} 0 0 0 ${xRight} ${yMiddle} ` +
                        `Q ${xMiddle} ${yMiddle + this.props.scleraRadius * (1 - this.props.closedCoefficient)}, ${xLeft} ${yMiddle}`
                    }>
                    </path>
                </svg>
            </svg>
        )
    }
}
