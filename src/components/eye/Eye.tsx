import React, { useEffect, useState } from 'react';
import tinycolor from 'tinycolor2';
import { EyeSide, irisSkewFactor, transitionTime } from '../../AppConstants';
import './Eye.css';
import { getMaxDisplacement } from './EyeUtils';
import { getInnerPath } from './getInnerPath';
import { Shadows } from './Shadows';

export interface IEyeProps {
    class: EyeSide;
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

export default function Eye(props: IEyeProps) {
    const circleTransitionStyle = {
        transition: `r ${transitionTime.dilate}ms, cx ${1000 /
            props.fps}ms, cy ${1000 / props.fps}ms,
            transform ${1000 / props.fps}ms`, // cx and cy transitions based on FPS
    };
    const innerTransitionStyle = {
        transition: `transform ${1000 / props.fps}ms`,
    };
    const eyelidTransitionStyle = {
        transition: `d ${transitionTime.blink}ms`,
    };
    const lineTransitionStyle = {
        transition: `d ${1000 / props.fps}ms`,
    };
    const eyeCoords = getEyeCoords(props);
    const bezier = getBezier(props);
    const cornerShape = getCornerShape(props);

    const [innerPath, setInnerPath] = useState(
        getInnerPath(props.width / 960, props.height / 1080),
    );
    const [irisAdjustment, setIrisAdjustment] = useState({
        scale: 1,
        angle: 0,
    });

    useEffect(() => {
        setInnerPath(getInnerPath(props.width / 960, props.height / 1080));
        setIrisAdjustment(getIrisAdjustment(props, irisAdjustment.angle));
    }, [props, irisAdjustment, innerPath]);

    return (
        <svg className={props.class} width={props.width} height={props.height}>
            <circle
                className={'sclera'}
                style={circleTransitionStyle}
                r={props.scleraRadius}
                fill={'url(#scleraGradient)'}
                cx={props.width / 2}
                cy={props.height / 2}
            />
            <g
                className="inner"
                style={innerTransitionStyle}
                transform={`
                rotate(${irisAdjustment.angle})
                scale(${irisAdjustment.scale}, 1)
                rotate(${-irisAdjustment.angle})
                `}
            >
                <circle
                    className={'iris'}
                    style={circleTransitionStyle}
                    r={props.irisRadius}
                    fill={'url(#irisGradient)'}
                    cx={props.innerX}
                    cy={props.innerY}
                />
                <g className="irisStyling">
                    <path
                        d={`M ${props.innerX} ${props.innerY} ${innerPath}`}
                        fill={tinycolor(props.irisColor)
                            .darken(10)
                            .toHexString()}
                        style={lineTransitionStyle}
                    />
                </g>
                <circle
                    className={'pupil'}
                    style={circleTransitionStyle}
                    r={props.pupilRadius}
                    fill={pupilColor}
                    cx={props.innerX}
                    cy={props.innerY}
                />
                <circle
                    className={'innerReflection'}
                    style={circleTransitionStyle}
                    r={props.pupilRadius}
                    fill={'url(#reflectionGradient)'}
                    cx={props.innerX + props.pupilRadius * 0.4}
                    cy={props.innerY - props.pupilRadius * 0.4}
                    transform={`skewX(20) translate(${(-145 / 960) *
                        props.width}, ${(5 / 1080) * props.height})`}
                />
                <circle
                    className={'outerReflection'}
                    style={circleTransitionStyle}
                    r={props.pupilRadius * 0.75}
                    fill={'url(#reflectionGradient)'}
                    cx={props.innerX + props.scleraRadius * 0.3}
                    cy={props.innerY - props.scleraRadius * 0.3}
                    transform={`skewX(20) translate(${(-140 / 960) *
                        props.width}, ${(5 / 1080) * props.height})`}
                />
            </g>

            <svg className="Eyelids">
                <path
                    style={eyelidTransitionStyle}
                    filter="url(#shadowTop)"
                    d={
                        // upper eyelid
                        `M ${eyeCoords.leftX} ${eyeCoords.middleY},
                         A ${props.scleraRadius} ${props.scleraRadius} 0 0 1 ${
                            eyeCoords.rightX
                        } ${eyeCoords.middleY}
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
                            bezier.scaledYcontrolOffset}, ${eyeCoords.leftX} ${
                            eyeCoords.middleY
                        }`
                    }
                />
                <path
                    style={eyelidTransitionStyle}
                    filter="url(#shadowBottom)"
                    d={
                        // lower eyelid
                        `M ${eyeCoords.leftX} ${eyeCoords.middleY},
                         A ${props.scleraRadius} ${props.scleraRadius} 0 0 0 ${
                            eyeCoords.rightX
                        } ${eyeCoords.middleY}
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
                            bezier.scaledYcontrolOffset}, ${eyeCoords.leftX} ${
                            eyeCoords.middleY
                        }`
                    }
                />
            </svg>
            <svg className="BlackFill">
                <path
                    d={`M 0 ${eyeCoords.middleY},
                         L ${eyeCoords.leftX} ${eyeCoords.middleY},
                         A ${props.scleraRadius} ${props.scleraRadius} 0 0 1 ${eyeCoords.rightX} ${eyeCoords.middleY}
                         L ${props.width} ${eyeCoords.middleY},
                         L ${props.width} 0
                         L 0 0`}
                />
                <path
                    d={`M 0 ${eyeCoords.middleY},
                         L ${eyeCoords.leftX} ${eyeCoords.middleY},
                         A ${props.scleraRadius} ${props.scleraRadius} 0 0 0 ${eyeCoords.rightX} ${eyeCoords.middleY}
                         L ${props.width} ${eyeCoords.middleY},
                         L ${props.width} ${props.height}
                         L 0 ${props.height}`}
                />
            </svg>
            <Shadows openCoefficient={props.openCoefficient} />
        </svg>
    );
}

function getEyeCoords(props: IEyeProps) {
    const middleX = props.width / 2;
    const leftX = middleX - props.scleraRadius;
    const rightX = middleX + props.scleraRadius;
    const middleY = props.height / 2;

    const topEyelidY = middleY - props.scleraRadius * props.openCoefficient;
    const bottomEyelidY = middleY + props.scleraRadius * props.openCoefficient;

    return {
        middleX,
        leftX,
        rightX,
        middleY,
        topEyelidY,
        bottomEyelidY,
    };
}

function getBezier(props: IEyeProps) {
    const curveConstant = 0.55228474983; // (4/3)tan(pi/8)
    const controlOffset = props.scleraRadius * curveConstant;
    const scaledYcontrolOffset = controlOffset * props.openCoefficient;
    const scaledXcontrolOffset = controlOffset - scaledYcontrolOffset;
    return { controlOffset, scaledXcontrolOffset, scaledYcontrolOffset };
}

function getCornerShape(props: IEyeProps) {
    const innerTopCoefficient = 1.45;
    const innerBottomCoefficient = 1.1;
    const outerTopCoefficient = 0.7;
    const outerBottomCoefficient = 0.5;
    return props.class === EyeSide.RIGHT
        ? {
              leftTop: innerTopCoefficient,
              rightTop: outerTopCoefficient,
              leftBottom: innerBottomCoefficient,
              rightBottom: outerBottomCoefficient,
          }
        : {
              leftTop: outerTopCoefficient,
              rightTop: innerTopCoefficient,
              leftBottom: outerBottomCoefficient,
              rightBottom: innerBottomCoefficient,
          };
}

function getIrisAdjustment(props: IEyeProps, previousAngle: number = 0) {
    const displacement = Math.hypot(
        props.innerX - props.width / 2,
        props.innerY - props.height / 2,
    );
    const maxDisplacement = getMaxDisplacement(
        props.scleraRadius,
        props.irisRadius,
    );

    const scale =
        irisSkewFactor +
        ((1 - irisSkewFactor) * (maxDisplacement - displacement)) /
            maxDisplacement;

    let angle =
        (Math.atan2(
            props.innerY - props.height / 2,
            props.innerX - props.width / 2,
        ) *
            180) /
        Math.PI;
    let shouldScaleX = true;
    while (angle - previousAngle < -90) {
        angle = angle + 180;
        shouldScaleX = !shouldScaleX;
    }
    while (angle - previousAngle >= 90) {
        angle = angle - 180;
        shouldScaleX = !shouldScaleX;
    }

    return {
        scale,
        angle,
    };
}
