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

    eyeCoords() {
        const middleX = this.props.width / 2;
        const leftX = middleX - this.props.scleraRadius;
        const rightX = middleX + this.props.scleraRadius;
        const middleY = this.props.height / 2;

        const topEyelidY =
            middleY - this.props.scleraRadius * this.props.openCoefficient;
        const bottomEyelidY =
            middleY + this.props.scleraRadius * this.props.openCoefficient;

        return {
            middleX,
            leftX,
            rightX,
            middleY,
            topEyelidY,
            bottomEyelidY,
        };
    }

    bezier() {
        const curveConstant = 0.55228474983; // (4/3)tan(pi/8)
        const controlOffset = this.props.scleraRadius * curveConstant;
        const scaledYcontrolOffset = controlOffset * this.props.openCoefficient;
        const scaledXcontrolOffset = controlOffset - scaledYcontrolOffset;
        return { controlOffset, scaledXcontrolOffset, scaledYcontrolOffset };
    }

    cornerShape() {
        const innerTopCoefficient = 1.45;
        const innerBottomCoefficient = 1.1;
        const outerTopCoefficient = 0.7;
        const outerBottomCoefficient = 0.5;
        if (this.props.class === eyes.RIGHT) {
            return {
                leftTop: innerTopCoefficient,
                rightTop: outerTopCoefficient,
                leftBottom: innerBottomCoefficient,
                rightBottom: outerBottomCoefficient,
            };
        } else {
            return {
                leftTop: outerTopCoefficient,
                rightTop: innerTopCoefficient,
                leftBottom: outerBottomCoefficient,
                rightBottom: innerBottomCoefficient,
            };
        }
    }

    irisAdjustment() {
        const irisXoffset = this.props.innerX - this.props.width / 2;
        const maxIrisXOffset = this.props.scleraRadius - this.props.irisRadius;

        let irisXDirection = Math.abs(irisXoffset) / irisXoffset;
        if (isNaN(irisXDirection)) {
            irisXDirection = 0;
        }
        const xScale = 1 - Math.abs(0.4 * irisXoffset) / maxIrisXOffset;
        const xSkew =
            (((xScale - 1) *
                (90 * (this.props.innerY - this.props.height / 2))) /
                this.props.scleraRadius) *
            irisXDirection;
        const innerX =
            this.props.innerX +
            irisXDirection *
                this.props.irisRadius *
                (((1 / xScale) * (1 - xScale)) / 0.4);

        return { xScale, xSkew, innerX };
    }

    render() {
        const eyeCoords = this.eyeCoords();
        const bezier = this.bezier();
        const cornerShape = this.cornerShape();
        const irisAdjustment = this.irisAdjustment();

        return (
            <svg
                className={this.props.class}
                width={this.props.width}
                height={this.props.height}
            >
                <circle
                    className={'sclera'}
                    style={this.circleTransitionStyle}
                    r={this.props.scleraRadius}
                    fill={'url(#scleraGradient)'}
                    cx={this.props.width / 2}
                    cy={this.props.height / 2}
                />
                <g
                    className="inner"
                    style={this.innerTransitionStyle}
                    transform={`scale(${irisAdjustment.xScale}, 1) skewX(${irisAdjustment.xSkew}) `}
                >
                    <circle
                        className={'iris'}
                        style={this.circleTransitionStyle}
                        r={this.props.irisRadius}
                        fill={'url(#irisGradient)'}
                        cx={irisAdjustment.innerX}
                        cy={this.props.innerY}
                    />
                    <g className="irisStyling">
                        <path
                            d={`M ${irisAdjustment.innerX} ${this.props.innerY} ${innerPath}`}
                            fill={tinycolor(this.props.irisColor)
                                .darken(10)
                                .toHexString()}
                            style={this.lineTransitionStyle}
                        />
                    </g>
                    <circle
                        className={'pupil'}
                        style={this.circleTransitionStyle}
                        r={this.props.pupilRadius}
                        fill={pupilColor}
                        cx={irisAdjustment.innerX}
                        cy={this.props.innerY}
                    />
                    <circle
                        className={'innerReflection'}
                        style={this.circleTransitionStyle}
                        r={this.props.pupilRadius}
                        fill={'url(#reflectionGradient)'}
                        cx={
                            irisAdjustment.innerX + this.props.pupilRadius * 0.4
                        }
                        cy={this.props.innerY - this.props.pupilRadius * 0.4}
                        transform={'skewX(20) translate(-165, 5)'}
                    />
                    <circle
                        className={'outerReflection'}
                        style={this.circleTransitionStyle}
                        r={this.props.pupilRadius * 0.75}
                        fill={'url(#reflectionGradient)'}
                        cx={
                            irisAdjustment.innerX +
                            this.props.scleraRadius * 0.3
                        }
                        cy={this.props.innerY - this.props.scleraRadius * 0.3}
                        transform={'skewX(20) translate(-165, 5)'}
                    />
                </g>

                <svg className="Eyelids">
                    <path
                        style={this.eyelidTransitionStyle}
                        filter="url(#shadowTop)"
                        d={
                            // upper eyelid
                            `M ${eyeCoords.leftX} ${eyeCoords.middleY},
                         A ${this.props.scleraRadius} ${
                                this.props.scleraRadius
                            } 0 0 1 ${eyeCoords.rightX} ${eyeCoords.middleY}
                         C ${eyeCoords.rightX -
                             cornerShape.rightTop *
                                 bezier.scaledXcontrolOffset} ${eyeCoords.middleY -
                                bezier.scaledYcontrolOffset},
                         ${eyeCoords.middleX + bezier.controlOffset} ${
                                eyeCoords.topEyelidY
                            }, ${eyeCoords.middleX} ${eyeCoords.topEyelidY}
                         C ${eyeCoords.middleX - bezier.controlOffset} ${
                                eyeCoords.topEyelidY
                            }, ${eyeCoords.leftX +
                                cornerShape.leftTop *
                                    bezier.scaledXcontrolOffset} ${eyeCoords.middleY -
                                bezier.scaledYcontrolOffset}, ${
                                eyeCoords.leftX
                            } ${eyeCoords.middleY}`
                        }
                    />
                    <path
                        style={this.eyelidTransitionStyle}
                        filter="url(#shadowBottom)"
                        d={
                            // lower eyelid
                            `M ${eyeCoords.leftX} ${eyeCoords.middleY},
                         A ${this.props.scleraRadius} ${
                                this.props.scleraRadius
                            } 0 0 0 ${eyeCoords.rightX} ${eyeCoords.middleY}
                         C ${eyeCoords.rightX -
                             cornerShape.rightBottom *
                                 bezier.scaledXcontrolOffset} ${eyeCoords.middleY +
                                bezier.scaledYcontrolOffset},
                         ${eyeCoords.middleX + bezier.controlOffset} ${
                                eyeCoords.bottomEyelidY
                            }, ${eyeCoords.middleX} ${eyeCoords.bottomEyelidY}
                         C ${eyeCoords.middleX - bezier.controlOffset} ${
                                eyeCoords.bottomEyelidY
                            }, ${eyeCoords.leftX +
                                cornerShape.leftBottom *
                                    bezier.scaledXcontrolOffset} ${eyeCoords.middleY +
                                bezier.scaledYcontrolOffset}, ${
                                eyeCoords.leftX
                            } ${eyeCoords.middleY}`
                        }
                    />
                </svg>
                <svg className="BlackFill">
                    <path
                        d={`M ${0} ${eyeCoords.middleY},
                         L ${eyeCoords.leftX} ${eyeCoords.middleY},
                         A ${this.props.scleraRadius} ${
                            this.props.scleraRadius
                        } 0 0 1 ${eyeCoords.rightX} ${eyeCoords.middleY}
                         L ${this.props.width} ${eyeCoords.middleY},
                         L ${this.props.width} 0
                         L 0 0`}
                    />
                    <path
                        d={`M ${0} ${eyeCoords.middleY},
                         L ${eyeCoords.leftX} ${eyeCoords.middleY},
                         A ${this.props.scleraRadius} ${
                            this.props.scleraRadius
                        } 0 0 0 ${eyeCoords.rightX} ${eyeCoords.middleY}
                         L ${this.props.width} ${eyeCoords.middleY},
                         L ${this.props.width} ${this.props.height}
                         L 0 ${this.props.height}`}
                    />
                </svg>
                <Shadows openCoefficient={this.props.openCoefficient} />
            </svg>
        );
    }
}
