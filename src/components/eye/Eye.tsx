import React from 'react';
import { EyeSide, transitionTimes } from '../../AppConstants';
import { IAnimationFrame } from '../../utils/pose/animations';
import './Eye.css';
import { Eyelids } from './eyeParts/Eyelids';
import Iris from './eyeParts/innerParts/Iris';
import { Pupil } from './eyeParts/innerParts/Pupil';
import { Reflection } from './eyeParts/innerParts/Reflection';
import { Shines } from './eyeParts/innerParts/Shines';
import { Sclera } from './eyeParts/Sclera';

export interface IEyeProps {
    animation: IAnimationFrame;
    class: EyeSide;
    width: number;
    height: number;
    scleraRadius: number;
    irisRadius: number;
    pupilRadius: number;
    innerPath: string;
    skewTransform: string;
    bezier: {
        controlOffset: number;
        scaledXcontrolOffset: number;
        scaledYcontrolOffset: number;
    };
    eyeShape: {
        leftX: number;
        rightX: number;
        middleY: number;
        middleX: number;
        topEyelidY: number;
        bottomEyelidY: number;
    };
    reflectionOpacity: number;
    reflection?: ImageData;
}

export default function Eye(props: IEyeProps) {
    const cornerShape = getCornerShape(props);
    const duration = props.animation.duration || transitionTimes.blink;
    const eyelidTransitionStyle = {
        transition: `d ${duration}ms`,
    };
    const transitionStyle = {
        transition: `transform ${props.animation.duration}ms`,
    };

    const overlaySvgProps = {
        className: 'overlay',
        width: props.width,
        height: props.height,
    };
    const innerEyeGroupProps = {
        // for same transform on all SVGs
        className: 'inner',
        style: transitionStyle,
        transform: `${props.skewTransform} translate(${
            props.animation.target!.x
        },${props.animation.target!.y})`,
    };
    const innerProps = {
        ...props,
        transitionStyle,
        groupProps: innerEyeGroupProps,
    };
    return (
        <div className={props.class}>
            <svg {...overlaySvgProps}>
                <Sclera
                    radius={props.scleraRadius}
                    width={props.width / 2}
                    height={props.height / 2}
                />
                <Iris {...innerProps} />
            </svg>

            <svg {...overlaySvgProps}>
                <Reflection {...innerProps} />
            </svg>

            <svg {...overlaySvgProps}>
                <g {...innerEyeGroupProps}>
                    <Pupil
                        {...props}
                        transitionStyle={transitionStyle}
                        useGradient={props.reflection !== undefined}
                    />
                    <Shines {...innerProps} />
                </g>
                <Eyelids
                    {...props}
                    transitionStyle={eyelidTransitionStyle}
                    cornerShape={cornerShape}
                />
            </svg>
        </div>
    );
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
