import React from 'react';
import tinycolor from 'tinycolor2';
import { eyes, transitionTime } from '../../AppConstants';
import './Eye.css';
import { innerPath } from './innerPath';
import { Shadows } from './Shadows';

export interface IEyeProps {
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

const pupilColor = 'black';

export default class Eye extends React.Component<IEyeProps> {
    private circleTransitionStyle: { transition: string };
    private eyelidTransitionStyle: { transition: string };
    private lineTransitionStyle: { transition: string };
    private innerTransitionStyle: { transition: string };

    constructor(props: IEyeProps) {
        super(props);
        this.circleTransitionStyle = {
            transition: `r ${transitionTime.dilate}ms, cx ${1000 /
                props.fps}ms, cy ${1000 / props.fps}ms`, // cx and cy transitions based on FPS
        };
        this.innerTransitionStyle = {
            transition: `transform ${1000 / props.fps}ms`,
        };
        this.eyelidTransitionStyle = {
            transition: `d ${transitionTime.blink}ms`,
        };
        this.lineTransitionStyle = {
            transition: `d ${1000 / props.fps}ms`,
        };
    }

    renderCircle(
        radius: number,
        name: string,
        color: string,
        centerX: number = this.props.width / 2,
        centerY: number = this.props.height / 2,
    ) {
        return (
            <circle
                style={this.circleTransitionStyle}
                r={radius}
                className={name}
                fill={color}
                cx={centerX}
                cy={centerY}
            />
        );
    }

    renderIrisStyling(offset: number) {
        const scale = this.props.width / 960; // component width divided by the width the styling was created at
        return (
            <g transform={`scale(${scale})`}>
                <path
                    d={`M ${this.props.innerX / scale + offset} ${this.props
                        .innerY / scale} ${innerPath}`}
                    fill={tinycolor(this.props.irisColor)
                        .darken(10)
                        .toHexString()}
                    style={this.lineTransitionStyle}
                />
            </g>
        );
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

        const irisOffset = this.props.innerX - this.props.width / 2;
        const maxOffset = this.props.scleraRadius - this.props.irisRadius;

        let dir = Math.abs(irisOffset) / irisOffset;
        if (isNaN(dir)) {
            dir = 0;
        }

        const scaleFactor = 1 - Math.abs(0.4 * irisOffset) / maxOffset;

        const skewFactor =
            (((scaleFactor - 1) *
                (90 * (this.props.innerY - this.props.height / 2))) /
                this.props.scleraRadius) *
            dir;

        const scaleOffset =
            dir *
            this.props.irisRadius *
            (((1 / scaleFactor) * (1 - scaleFactor)) / 0.4);

        return (
            <svg
                className={this.props.class}
                width={this.props.width}
                height={this.props.height}
            >
                {this.renderCircle(
                    this.props.scleraRadius,
                    'sclera',
                    'url(#scleraGradient)',
                )}
                <g
                    className="inner"
                    style={this.innerTransitionStyle}
                    transform={`scale(${scaleFactor}, 1) skewX(${skewFactor}) `}
                >
                    {this.renderCircle(
                        this.props.irisRadius,
                        'iris',
                        'url(#irisGradient)',
                        this.props.innerX + scaleOffset,
                        this.props.innerY,
                    )}
                    {this.renderIrisStyling(scaleOffset)}
                    {this.renderCircle(
                        this.props.pupilRadius * this.props.dilatedCoefficient,
                        'pupil',
                        pupilColor,
                        this.props.innerX + scaleOffset,
                        this.props.innerY,
                    )}
                    {this.renderCircle(
                        this.props.pupilRadius,
                        'reflection',
                        'url(#reflectionGradient)',
                        this.props.innerX +
                            this.props.pupilRadius * 0.4 +
                            scaleOffset,
                        this.props.innerY - this.props.pupilRadius * 0.4,
                    )}
                    {this.renderCircle(
                        this.props.pupilRadius,
                        'reflection',
                        'url(#reflectionGradient)',
                        this.props.innerX +
                            this.props.scleraRadius * 0.3 +
                            scaleOffset,
                        this.props.innerY - this.props.scleraRadius * 0.3,
                    )}
                </g>

                <svg className="Eyelids">
                    <path
                        style={this.eyelidTransitionStyle}
                        filter="url(#shadowTop)"
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
                        filter="url(#shadowBottom)"
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
                <Shadows openCoefficient={this.props.openCoefficient} />
            </svg>
        );
    }
}
