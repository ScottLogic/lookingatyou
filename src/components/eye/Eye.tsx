import React from 'react';
<<<<<<< HEAD
import { eyes, transitionTime } from '../../AppConstants';
=======
import tinycolor from 'tinycolor2';
import { FPS, transitionTime } from '../../AppConstants';
>>>>>>> added gradients to the iris, inner lines and reflections
import './Eye.css';

interface IEyeProps {
    class: string;
    width: number;
    height: number;
    irisColor: string;
    scleraRadius: number;
    irisRadius: number;
    pupilRadius: number;
    openCoefficient: number;
    dilatedCoefficient: number;
    innerX: number;
    innerY: number;
    fps: number;
}

export default class Eye extends React.Component<IEyeProps> {
    elements: number;
    r1: number;
    r2: number;
    circ1DistRadians: number;
    circ2DistRadians: number;
    startX: number;
    startY: number;
    private circleTransitionStyle: { transition: string };
    private eyelidTransitionStyle: { transition: string };
    constructor(props: IEyeProps) {
        super(props);
        this.circleTransitionStyle = {
            transition: `r ${transitionTime.dilate}ms, cx ${1000 /
                props.fps}ms, cy ${1000 / props.fps}ms`, // cx and cy transitions based on FPS
        };
        this.eyelidTransitionStyle = {
            transition: `d ${transitionTime.blink}ms`,
        };
        this.elements = 10;
        this.r1 = this.props.irisRadius * 0.1;
        this.r2 = this.props.irisRadius * 0.9;
        this.circ1DistRadians = ((360 / this.elements) * Math.PI) / 180;
        this.circ2DistRadians = ((360 / this.elements) * Math.PI) / 180;
        this.startX = this.props.innerX;
        this.startY = this.props.innerY;
    }

    componentDidUpdate() {
        this.startX = this.props.innerX;
        this.startY = this.props.innerY;
    }

    renderCircle(
        radius: number,
        name: string,
        centerX: number = this.props.width / 2,
        centerY: number = this.props.height / 2,
    ) {
        return (
            <circle
                style={this.circleTransitionStyle}
                r={radius}
                className={name}
                // fill={colour}
                cx={centerX}
                cy={centerY}
            />
        );
    }

    renderInside() {
        let myInside = `M ${this.startX} ${this.startY}, `;

        for (let i = 0; i <= this.elements; i++) {
            const out = `L ${this.r2 * Math.cos(this.circ2DistRadians * i) +
                this.startX} ${this.r2 * Math.sin(this.circ2DistRadians * i) +
                this.startY},`;

            const inLine = `L ${this.r1 * Math.cos(this.circ1DistRadians * i) +
                this.startX} ${this.r1 * Math.sin(this.circ1DistRadians * i) +
                this.startY}, `;

            myInside += out;
            myInside += inLine;
        }
        return myInside;
    }

    render() {
        const eyeMiddleX = this.props.width / 2;
        const eyeLeft = eyeMiddleX - this.props.scleraRadius;
        const eyeRight = eyeMiddleX + this.props.scleraRadius;
        const eyeMiddleY = this.props.height / 2;

        const topEyelidY =
            eyeMiddleY - this.props.scleraRadius * this.props.openCoefficient;
        const bottomEyelidY =
            eyeMiddleY + this.props.scleraRadius * this.props.openCoefficient;

        const bezierCurveConstant = 0.55228474983; // (4/3)tan(pi/8)
        const bezierControlOffset =
            this.props.scleraRadius * bezierCurveConstant;
        const scaledYBezierControlOffset =
            bezierControlOffset * this.props.openCoefficient;
        const scaledXBezierControlOffset =
            bezierControlOffset - scaledYBezierControlOffset;
        const innerTopCoefficient = 1.45;
        const innerBottomCoefficient = 1.1;
        const outerTopCoefficient = 0.7;
        const outerBottomCoefficient = 0.5;
        let leftTopCoefficient;
        let rightTopCoefficient;
        let leftBottomCoefficient;
        let rightBottomCoefficient;
        if (this.props.class === eyes.RIGHT) {
            leftTopCoefficient = innerTopCoefficient;
            rightTopCoefficient = outerTopCoefficient;
            leftBottomCoefficient = innerBottomCoefficient;
            rightBottomCoefficient = outerBottomCoefficient;
        } else {
            leftTopCoefficient = outerTopCoefficient;
            rightTopCoefficient = innerTopCoefficient;
            leftBottomCoefficient = outerBottomCoefficient;
            rightBottomCoefficient = innerBottomCoefficient;
        }
        return (
            <svg
                className={this.props.class}
                width={this.props.width}
                height={this.props.height}
            >
                {this.renderCircle(this.props.scleraRadius, 'sclera')}
                <g className="inner">
                    {this.renderCircle(
                        this.props.irisRadius,
                        'iris',
                        this.props.innerX,
                        this.props.innerY,
                    )}
                    {/* <path
                        d={this.renderInside()}
                        fill={tinycolor(this.props.irisColor)
                            .darken(5)
                            .toHexString()}
                    /> */}
                    {this.renderCircle(
                        this.props.pupilRadius * this.props.dilatedCoefficient,
                        'pupil',
                        this.props.innerX,
                        this.props.innerY,
                    )}
                    <circle
                        r={this.props.pupilRadius}
                        className={'reflection'}
                        // fill={colour}
                        cx={this.props.innerX + this.props.pupilRadius * 0.4}
                        cy={this.props.innerY - this.props.pupilRadius * 0.4}
                        transform="skewX(20) translate(-165, 0) "
                    />
                    <circle
                        r={this.props.pupilRadius}
                        className={'reflection'}
                        // fill={colour}
                        cx={this.props.innerX + this.props.scleraRadius * 0.3}
                        cy={this.props.innerY - this.props.scleraRadius * 0.3}
                        transform="skewX(20) translate(-165, 5) "
                    />
                </g>
                <svg />
                <svg className="Eyelids">
                    <path
                        style={this.eyelidTransitionStyle}
                        d={
                            // upper eyelid
                            `M ${eyeLeft} ${eyeMiddleY},
                         A ${this.props.scleraRadius} ${
                                this.props.scleraRadius
                            } 0 0 1 ${eyeRight} ${eyeMiddleY}
                         C ${eyeRight -
                             rightTopCoefficient *
                                 scaledXBezierControlOffset} ${eyeMiddleY -
                                scaledYBezierControlOffset},
                         ${eyeMiddleX +
                             bezierControlOffset} ${topEyelidY}, ${eyeMiddleX} ${topEyelidY}
                         C ${eyeMiddleX -
                             bezierControlOffset} ${topEyelidY}, ${eyeLeft +
                                leftTopCoefficient *
                                    scaledXBezierControlOffset} ${eyeMiddleY -
                                scaledYBezierControlOffset}, ${eyeLeft} ${eyeMiddleY}`
                        }
                    />
                    <path
                        style={this.eyelidTransitionStyle}
                        d={
                            // lower eyelid
                            `M ${eyeLeft} ${eyeMiddleY},
                         A ${this.props.scleraRadius} ${
                                this.props.scleraRadius
                            } 0 0 0 ${eyeRight} ${eyeMiddleY}
                         C ${eyeRight -
                             rightBottomCoefficient *
                                 scaledXBezierControlOffset} ${eyeMiddleY +
                                scaledYBezierControlOffset},
                         ${eyeMiddleX +
                             bezierControlOffset} ${bottomEyelidY}, ${eyeMiddleX} ${bottomEyelidY}
                         C ${eyeMiddleX -
                             bezierControlOffset} ${bottomEyelidY}, ${eyeLeft +
                                leftBottomCoefficient *
                                    scaledXBezierControlOffset} ${eyeMiddleY +
                                scaledYBezierControlOffset}, ${eyeLeft} ${eyeMiddleY}`
                        }
                    />
                </svg>
                <svg className="BlackFill">
                    <path
                        d={
                            // upper eyelid
                            `M ${0} ${eyeMiddleY},
                         L ${eyeLeft} ${eyeMiddleY},
                         A ${this.props.scleraRadius} ${
                                this.props.scleraRadius
                            } 0 0 1 ${eyeRight} ${eyeMiddleY}
                         L ${this.props.width} ${eyeMiddleY},
                         L ${this.props.width} 0
                         L 0 0`
                        }
                    />
                    <path
                        d={
                            // upper eyelid
                            `M ${0} ${eyeMiddleY},
                         L ${eyeLeft} ${eyeMiddleY},
                         A ${this.props.scleraRadius} ${
                                this.props.scleraRadius
                            } 0 0 0 ${eyeRight} ${eyeMiddleY}
                         L ${this.props.width} ${eyeMiddleY},
                         L ${this.props.width} ${this.props.height}
                         L 0 ${this.props.height}`
                        }
                    />
                </svg>
            </svg>
        );
    }
}
