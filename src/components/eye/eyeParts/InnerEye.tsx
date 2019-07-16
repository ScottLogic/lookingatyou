import React from 'react';
import isEqual from 'react-fast-compare';
import tinycolor from 'tinycolor2';

interface IInnerEyeProps {
    innerTransitionStyle: any;
    circleTransitionStyle: any;
    lineTransitionStyle: any;
    irisAdjustment: { xScale: number; xSkew: number; innerX: number };
    irisRadius: number;
    innerY: number;
    irisColor: string;
    innerPath: any;
    pupilRadius: number;
    pupilColor: string;
    dilatedCoefficient: number;
    scleraRadius: number;
    width: number;
    height: number;
}

export const InnerEye = React.memo(
    (props: IInnerEyeProps) => {
        return (
            <g
                className="inner"
                style={props.innerTransitionStyle}
                transform={`
                scale(${props.irisAdjustment.xScale}, 1)
                skewX(${props.irisAdjustment.xSkew})
                `}
            >
                <circle
                    className={'iris'}
                    style={props.circleTransitionStyle}
                    r={props.irisRadius}
                    fill={'url(#irisGradient)'}
                    cx={props.irisAdjustment.innerX}
                    cy={props.innerY}
                />
                <g className="irisStyling">
                    <path
                        d={`M ${props.irisAdjustment.innerX} ${props.innerY} ${props.innerPath}`}
                        fill={tinycolor(props.irisColor)
                            .darken(10)
                            .toHexString()}
                        style={props.lineTransitionStyle}
                    />
                </g>
                <circle
                    className={'pupil'}
                    style={props.circleTransitionStyle}
                    r={props.pupilRadius * props.dilatedCoefficient}
                    fill={props.pupilColor}
                    cx={props.irisAdjustment.innerX}
                    cy={props.innerY}
                />
                <circle
                    className={'innerReflection'}
                    style={props.circleTransitionStyle}
                    r={props.pupilRadius}
                    fill={'url(#reflectionGradient)'}
                    cx={props.irisAdjustment.innerX + props.pupilRadius * 0.4}
                    cy={props.innerY - props.pupilRadius * 0.4}
                    transform={`skewX(20) translate(${(-145 / 960) *
                        props.width}, ${(5 / 1080) * props.height})`}
                />
                <circle
                    className={'outerReflection'}
                    style={props.circleTransitionStyle}
                    r={props.pupilRadius * 0.75}
                    fill={'url(#reflectionGradient)'}
                    cx={props.irisAdjustment.innerX + props.scleraRadius * 0.3}
                    cy={props.innerY - props.scleraRadius * 0.3}
                    transform={`skewX(20) translate(${(-140 / 960) *
                        props.width}, ${(5 / 1080) * props.height})`}
                />
            </g>
        );
    },
    (previous, next) => isEqual(previous, next),
);
