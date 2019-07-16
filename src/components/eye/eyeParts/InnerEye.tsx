import React from 'react';
import isEqual from 'react-fast-compare';
import tinycolor from 'tinycolor2';

interface IInnerEyeProps {
    innerTransitionStyle: { transition: string };
    circleTransitionStyle: { transition: string };
    lineTransitionStyle: { transition: string };
    ellipseTransitionStyle: { transition: string };
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
                <ellipse
                    className={'innerReflection'}
                    style={props.ellipseTransitionStyle}
                    rx={props.pupilRadius * 0.375}
                    ry={props.pupilRadius * 0.75}
                    fill={'url(#reflectionGradient)'}
                    cx={props.irisAdjustment.innerX + props.pupilRadius}
                    cy={props.innerY}
                    transform={`rotate(-45,${props.irisAdjustment.innerX},${props.innerY})`}
                />
                <ellipse
                    className={'outerReflection'}
                    style={props.ellipseTransitionStyle}
                    rx={props.pupilRadius * 0.5}
                    ry={props.pupilRadius}
                    fill={'url(#reflectionGradient)'}
                    cx={props.irisAdjustment.innerX + props.irisRadius}
                    cy={props.innerY}
                    transform={`rotate(-45,${props.irisAdjustment.innerX},${props.innerY})`}
                />
            </g>
        );
    },
    (previous, next) => isEqual(previous, next),
);
