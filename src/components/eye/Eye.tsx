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
    dilatedCoefficient: number
}

export default class Eye extends React.Component<IEyeProps> {

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
        const eyeMiddleX = this.props.width / 2;
        const eyeLeft = eyeMiddleX - this.props.scleraRadius;
        const eyeRight = eyeMiddleX + this.props.scleraRadius;
        const eyeMiddleY = this.props.height / 2;

        const topEyelidY = eyeMiddleY - this.props.scleraRadius * this.props.openCoefficient;
        const bottomEyelidY = eyeMiddleY + this.props.scleraRadius * this.props.openCoefficient;

        const bezierCurveConstant = 0.55228474983; // (4/3)tan(pi/8)
        const bezierControlOffset = this.props.scleraRadius * bezierCurveConstant * this.props.openCoefficient;
        return (
            <svg className={this.props.class} width={this.props.width} height={this.props.height} >
                {this.renderCircle(this.props.scleraRadius, "sclera", this.props.scleraColor)}
                <g className="inner">
                    {this.renderCircle(this.props.irisRadius, "iris", this.props.irisColor)}
                    {this.renderCircle(this.props.pupilRadius * this.props.dilatedCoefficient, "pupil", this.props.pupilColor)}
                </g>
                <svg className="Eyelids"> 
                    <path d={ // upper eyelid
                        `M ${eyeLeft} ${eyeMiddleY},
                         A ${this.props.scleraRadius} ${this.props.scleraRadius} 0 0 1 ${eyeRight} ${eyeMiddleY}
                         C ${eyeRight} ${eyeMiddleY - bezierControlOffset}, ${eyeMiddleX + bezierControlOffset} ${topEyelidY}, ${eyeMiddleX} ${topEyelidY}
                         C ${eyeMiddleX - bezierControlOffset} ${topEyelidY}, ${eyeLeft} ${eyeMiddleY - bezierControlOffset}, ${eyeLeft} ${eyeMiddleY}`
                    }>
                    </path>
                    <path d={ // lower eyelid
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
