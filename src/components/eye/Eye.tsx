import React from 'react';
import './Eye.css';

interface IEyeProps {
    class: string;
    width: number;
    height: number;
    scleraColor: string;
    irisColor: string;
    pupilColor: string;
    scleraRadius: number;
    irisRadius: number;
    pupilRadius: number;
    openCoefficient: number;
    dilatedCoefficient: number;
    isBlinking: boolean;
    transitionTime: string;
    innerX: number;
    innerY: number;
}

export default class Eye extends React.Component<IEyeProps> {
    private transitionStyle: { transition: string };

    constructor(props: IEyeProps) {
        super(props);
        this.transitionStyle = { transition: props.transitionTime };
    }

    public renderCircle(
        radius: number,
        name: string,
        colour: string,
        centerX: number = this.props.width / 2,
        centerY: number = this.props.height / 2,
    ) {
        return (
            <circle
                style={{
                    transition:
                        'all ' +
                        this.props.transitionTime.toString() +
                        ' linear 0s',
                }}
                r={radius}
                className={name}
                fill={colour}
                cx={centerX}
                cy={centerY}
            />
        );
    }

    public render() {
        const openCoefficient = this.props.isBlinking
            ? 0
            : this.props.openCoefficient;

        const eyeMiddleX = this.props.width / 2;
        const eyeLeft = eyeMiddleX - this.props.scleraRadius;
        const eyeRight = eyeMiddleX + this.props.scleraRadius;
        const eyeMiddleY = this.props.height / 2;

        const topEyelidY =
            eyeMiddleY - this.props.scleraRadius * openCoefficient;
        const bottomEyelidY =
            eyeMiddleY + this.props.scleraRadius * openCoefficient;

        const bezierCurveConstant = 0.55228474983; // (4/3)tan(pi/8)
        const bezierControlOffset =
            this.props.scleraRadius * bezierCurveConstant * openCoefficient;
        return (
            <svg
                className={this.props.class}
                width={this.props.width}
                height={this.props.height}
            >
                {this.renderCircle(
                    this.props.scleraRadius,
                    'sclera',
                    this.props.scleraColor,
                )}
                <g className="inner">
                    {this.renderCircle(
                        this.props.irisRadius,
                        'iris',
                        this.props.irisColor,
                        this.props.innerX,
                        this.props.innerY,
                    )}
                    {this.renderCircle(
                        this.props.pupilRadius * this.props.dilatedCoefficient,
                        'pupil',
                        this.props.pupilColor,
                        this.props.innerX,
                        this.props.innerY,
                    )}
                </g>
                <svg className="Eyelids">
                    <path
                        style={this.transitionStyle}
                        d={
                            // upper eyelid
                            `M ${eyeLeft} ${eyeMiddleY},
                         A ${this.props.scleraRadius} ${
                                this.props.scleraRadius
                            } 0 0 1 ${eyeRight} ${eyeMiddleY}
                         C ${eyeRight} ${eyeMiddleY -
                                bezierControlOffset}, ${eyeMiddleX +
                                bezierControlOffset} ${topEyelidY}, ${eyeMiddleX} ${topEyelidY}
                         C ${eyeMiddleX -
                             bezierControlOffset} ${topEyelidY}, ${eyeLeft} ${eyeMiddleY -
                                bezierControlOffset}, ${eyeLeft} ${eyeMiddleY}`
                        }
                    />
                    <path
                        style={this.transitionStyle}
                        d={
                            // lower eyelid
                            `M ${eyeLeft} ${eyeMiddleY},
                         A ${this.props.scleraRadius} ${
                                this.props.scleraRadius
                            } 0 0 0 ${eyeRight} ${eyeMiddleY}
                         C ${eyeRight} ${eyeMiddleY +
                                bezierControlOffset}, ${eyeMiddleX +
                                bezierControlOffset} ${bottomEyelidY}, ${eyeMiddleX} ${bottomEyelidY}
                         C ${eyeMiddleX -
                             bezierControlOffset} ${bottomEyelidY}, ${eyeLeft} ${eyeMiddleY +
                                bezierControlOffset}, ${eyeLeft} ${eyeMiddleY}`
                        }
                    />
                </svg>
                <svg className="BlackFill">
                    <path
                        style={this.transitionStyle}
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
                        style={this.transitionStyle}
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
