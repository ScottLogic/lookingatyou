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
    openCoefficient: number,
    dilatedCoefficient: number,
    isBlinking: boolean,
    transitionTime: string
}

export default class Eye extends React.Component<IEyeProps> {

    private transitionStyle : {transition: string}

    constructor(props: IEyeProps) {
        super(props);
        this.transitionStyle = {transition : props.transitionTime}
    }

    renderCircle(radius: number, name: string, colour: string) {
        return (
            <circle
                style = {{transition: "all " + this.props.transitionTime.toString() + " linear 0s"}}
                r={radius}
                className={name}
                fill={colour}
                cx="50%"
                cy="50%"
            />
        )
    }

    render() {
        var openCoefficient = this.props.isBlinking? 0 : this.props.openCoefficient;

        var eyeMiddleX = this.props.width / 2;
        var eyeLeft = eyeMiddleX - this.props.scleraRadius;
        var eyeRight = eyeMiddleX + this.props.scleraRadius;
        var eyeMiddleY = this.props.height / 2;

        var topEyelidY = eyeMiddleY - this.props.scleraRadius * openCoefficient;
        var bottomEyelidY = eyeMiddleY + this.props.scleraRadius * openCoefficient;

        var bezierCurveConstant = 0.55228474983; // (4/3)tan(pi/8)
        var bezierControlOffset = this.props.scleraRadius * bezierCurveConstant * openCoefficient;
        return (
            <svg className={this.props.class} width={this.props.width} height={this.props.height} >
                {this.renderCircle(this.props.scleraRadius, "sclera", this.props.scleraColor)}
                <g className="inner">
                    {this.renderCircle(this.props.irisRadius, "iris", this.props.irisColor)}
                    {this.renderCircle(this.props.pupilRadius * this.props.dilatedCoefficient, "pupil", this.props.pupilColor)}
                </g>
                <svg className="Eyelids"> 
                    <path style = {this.transitionStyle} d={ // upper eyelid
                        `M ${eyeLeft} ${eyeMiddleY},
                         A ${this.props.scleraRadius} ${this.props.scleraRadius} 0 0 1 ${eyeRight} ${eyeMiddleY}
                         C ${eyeRight} ${eyeMiddleY - bezierControlOffset}, ${eyeMiddleX + bezierControlOffset} ${topEyelidY}, ${eyeMiddleX} ${topEyelidY}
                         C ${eyeMiddleX - bezierControlOffset} ${topEyelidY}, ${eyeLeft} ${eyeMiddleY - bezierControlOffset}, ${eyeLeft} ${eyeMiddleY}`
                    }>
                    </path>
                    <path style = {this.transitionStyle} d={ // lower eyelid
                        `M ${eyeLeft} ${eyeMiddleY},
                         A ${this.props.scleraRadius} ${this.props.scleraRadius} 0 0 0 ${eyeRight} ${eyeMiddleY}
                         C ${eyeRight} ${eyeMiddleY + bezierControlOffset}, ${eyeMiddleX + bezierControlOffset} ${bottomEyelidY}, ${eyeMiddleX} ${bottomEyelidY}
                         C ${eyeMiddleX - bezierControlOffset} ${bottomEyelidY}, ${eyeLeft} ${eyeMiddleY + bezierControlOffset}, ${eyeLeft} ${eyeMiddleY}`
                    }>
                    </path>
                </svg>
            </svg>
        )
    }
}
