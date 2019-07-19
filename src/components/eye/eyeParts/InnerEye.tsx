import React, { useEffect, useRef } from 'react';
import isEqual from 'react-fast-compare';
import tinycolor from 'tinycolor2';
import { getIrisAdjustment } from '../EyeUtils';

interface IInnerEyeProps {
    innerTransitionStyle: { transition: string };
    circleTransitionStyle: { transition: string };
    lineTransitionStyle: { transition: string };
    ellipseTransitionStyle: { transition: string };
    irisRadius: number;
    innerY: number;
    innerX: number;
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
        const irisAdjustmentRef = useRef({ scale: 1, angle: 0 });
        const irisAdjustment = getIrisAdjustment(
            props.innerX,
            props.innerY,
            props.height,
            props.width,
            props.scleraRadius,
            props.irisRadius,
            irisAdjustmentRef.current.angle,
        );

        useEffect(() => {
            irisAdjustmentRef.current = irisAdjustment;
        }, [irisAdjustment]);

        return (
            <g
                className="inner"
                style={props.innerTransitionStyle}
                transform={`
                    rotate(${irisAdjustment.angle})
                    scale(${irisAdjustment.scale}, 1)
                    rotate(${-irisAdjustment.angle})
                `}
            >
                <circle
                    className={'iris'}
                    style={props.circleTransitionStyle}
                    r={props.irisRadius}
                    fill={'url(#irisGradient)'}
                    cx={props.innerX}
                    cy={props.innerY}
                />
                <g className="irisStyling">
                    <path
                        d={`M ${props.innerX} ${props.innerY} ${props.innerPath}`}
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
                    cx={props.innerX}
                    cy={props.innerY}
                />
                <ellipse
                    className={'innerReflection'}
                    style={props.ellipseTransitionStyle}
                    rx={props.pupilRadius * 0.375}
                    ry={props.pupilRadius * 0.75}
                    fill={'url(#reflectionGradient)'}
                    cx={props.innerX + props.pupilRadius * 0.4}
                    cy={props.innerY - props.pupilRadius * 0.4}
                    transform={`skewX(20) translate(${(-145 / 960) *
                        props.width}, ${(5 / 1080) * props.height})`}
                />
                <ellipse
                    className={'outerReflection'}
                    style={props.ellipseTransitionStyle}
                    rx={props.pupilRadius * 0.5}
                    ry={props.pupilRadius}
                    fill={'url(#reflectionGradient)'}
                    cx={props.innerX + props.scleraRadius * 0.3}
                    cy={props.innerY - props.scleraRadius * 0.3}
                    transform={`skewX(20) translate(${(-140 / 960) *
                        props.width}, ${(5 / 1080) * props.height})`}
                />
            </g>
        );
    },
    (previous, next) => isEqual(previous, next),
);
