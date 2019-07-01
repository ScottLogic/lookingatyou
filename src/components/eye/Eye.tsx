import React from 'react';
import tinycolor from 'tinycolor2';
import { eyes, transitionTime } from '../../AppConstants';
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
    private lineTransitionStyle: { transition: string };
    constructor(props: IEyeProps) {
        super(props);
        this.circleTransitionStyle = {
            transition: `r ${transitionTime.dilate}ms, cx ${1000 /
                props.fps}ms, cy ${1000 / props.fps}ms`, // cx and cy transitions based on FPS
        };
        this.eyelidTransitionStyle = {
            transition: `d ${transitionTime.blink}ms`,
        };
        this.lineTransitionStyle = {
            transition: `d ${1000 / props.fps}`,
        };
        this.elements = 100;
        this.r1 = this.props.irisRadius * 0.1;
        this.r2 = this.props.irisRadius * 0.9;
        this.circ1DistRadians = ((360 / this.elements) * Math.PI) / 180;
        this.circ2DistRadians = ((360 / this.elements) * Math.PI) / 180;
        this.startX = 0;
        this.startY = 0;
    }

    componentDidUpdate() {}

    renderCircle(
        radius: number,
        name: string,
        centerX: number = this.props.width / 2,
        centerY: number = this.props.height / 2,
        transform: string = '',
    ) {
        return (
            <circle
                style={this.circleTransitionStyle}
                r={radius}
                className={name}
                cx={centerX}
                cy={centerY}
                transform={transform}
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

    renderInside2() {
        return (
            <path
                d={`M ${this.props.innerX} ${this.props.innerY}, l137.25,0l-122,0l121.729,8.618l-121.759,-7.66l120.948,16.244l-121.038,-15.291l119.689,23.807l-119.839,-22.86l117.958,31.275l-118.167,-30.34l115.762,38.62l-116.029,-37.7l113.108,45.812l-113.433,-44.911l110.009,52.824l-110.389,-51.945l106.474,59.628l-106.909,-58.774l102.52,66.195l-103.008,-65.371l98.162,72.503l-98.7,-71.71l93.415,78.522l-94.003,-77.765l88.301,84.233l-88.934,-83.515l82.837,89.612l-83.515,-88.934l77.047,94.636l-77.765,-94.003l70.953,99.288l-71.71,-98.7l64.578,103.546l-65.371,-103.008l57.95,107.397l-58.774,-106.909l51.091,110.824l-51.945,-110.389l44.032,113.813l-44.911,-113.433l36.799,116.354l-37.7,-116.029l29.42,118.434l-30.34,-118.167l21.925,120.048l-22.86,-119.839l14.344,121.188l-15.291,-121.038l6.707,121.849l-7.66,-121.759l-0.958,122.03l0,-122l-8.618,121.729l7.66,-121.759l-16.244,120.948l15.291,-121.038l-23.807,119.689l22.86,-119.839l-31.275,117.958l30.34,-118.167l-38.62,115.762l37.7,-116.029l-45.812,113.108l44.911,-113.433l-52.824,110.009l51.945,-110.389l-59.628,106.474l58.774,-106.909l-66.195,102.52l65.371,-103.008l-72.503,98.162l71.71,-98.7l-78.522,93.415l77.765,-94.003l-84.233,88.301l83.515,-88.934l-89.612,82.837l88.934,-83.515l-94.636,77.047l94.003,-77.765l-99.288,70.953l98.7,-71.71l-103.546,64.578l103.008,-65.371l-107.397,57.95l106.909,-58.774l-110.824,51.091l110.389,-51.945l-113.813,44.032l113.433,-44.911l-116.354,36.799l116.029,-37.7l-118.434,29.42l118.167,-30.34l-120.048,21.925l119.839,-22.86l-121.188,14.344l121.038,-15.291l-121.849,6.707l121.759,-7.66l-122.03,-0.958l122,0l-121.729,-8.618l121.759,7.66l-120.948,-16.244l121.038,15.291l-119.689,-23.807l119.839,22.86l-117.958,-31.275l118.167,30.34l-115.762,-38.62l116.029,37.7l-113.108,-45.812l113.433,44.911l-110.009,-52.824l110.389,51.945l-106.474,-59.628l106.909,58.774l-102.52,-66.195l103.008,65.371l-98.162,-72.503l98.7,71.71l-93.415,-78.522l94.003,77.765l-88.301,-84.233l88.934,83.515l-82.837,-89.612l83.515,88.934l-77.047,-94.636l77.765,94.003l-70.953,-99.288l71.71,98.7l-64.578,-103.546l65.371,103.008l-57.95,-107.397l58.774,106.909l-51.091,-110.824l51.945,110.389l-44.032,-113.813l44.911,113.433l-36.799,-116.354l37.7,116.029l-29.42,-118.434l30.34,118.167l-21.925,-120.048l22.86,119.839l-14.344,-121.188l15.291,121.038l-6.707,-121.849l7.66,121.759l0.958,-122.03l0,122l8.618,-121.729l-7.66,121.759l16.244,-120.948l-15.291,121.038l23.807,-119.689l-22.86,119.839l31.275,-117.958l-30.34,118.167l38.62,-115.762l-37.7,116.029l45.812,-113.108l-44.911,113.433l52.824,-110.009l-51.945,110.389l59.628,-106.474l-58.774,106.909l66.195,-102.52l-65.371,103.008l72.503,-98.162l-71.71,98.7l78.522,-93.415l-77.765,94.003l84.233,-88.301l-83.515,88.934l89.612,-82.837l-88.934,83.515l94.636,-77.047l-94.003,77.765l99.288,-70.953l-98.7,71.71l103.546,-64.578l-103.008,65.371l107.397,-57.95l-106.909,58.774l110.824,-51.091l-110.389,51.945l113.813,-44.032l-113.433,44.911l116.354,-36.799l-116.029,37.7l118.434,-29.42l-118.167,30.34l120.048,-21.925l-119.839,22.86l121.188,-14.344l-121.038,15.291l121.849,-6.707l-121.759,7.66l122.03,0.958l-122,0`}
                fill={tinycolor(this.props.irisColor)
                    .darken(10)
                    .toHexString()}
                style={{ transition: `d ${1000 / this.props.fps}ms` }}
            />
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
                    {this.renderInside2()}
                    {this.renderCircle(
                        this.props.pupilRadius * this.props.dilatedCoefficient,
                        'pupil',
                        this.props.innerX,
                        this.props.innerY,
                    )}
                    {this.renderCircle(
                        this.props.pupilRadius,
                        'reflection',
                        this.props.innerX + this.props.pupilRadius * 0.4,
                        this.props.innerY - this.props.pupilRadius * 0.4,
                        'skewX(20) translate(-165, 0)',
                    )}
                    {this.renderCircle(
                        this.props.pupilRadius,
                        'reflection',
                        this.props.innerX + this.props.scleraRadius * 0.3,
                        this.props.innerY - this.props.scleraRadius * 0.3,
                        'skewX(20) translate(-165, 5)',
                    )}
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
