import React from 'react';
import { EyeSide, transitionTimes } from '../../AppConstants';
import { IAnimationFrame } from '../../utils/pose/animations';
import './Eye.css';
import { BlackFill } from './eyeParts/BlackFill';
import { Eyelids } from './eyeParts/Eyelids';
import InnerEye from './eyeParts/InnerEye';
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
    reflection?: ImageData;
}

export default function Eye(props: IEyeProps) {
    const cornerShape = getCornerShape(props);
    const duration = props.animation.duration || transitionTimes.blink;
    const eyelidTransitionStyle = {
        transition: `d ${duration}ms`,
    };

    return (
        <svg className={props.class} width={props.width} height={props.height}>
            <Sclera
                radius={props.scleraRadius}
                width={props.width / 2}
                height={props.height / 2}
            />
            <InnerEye {...props} />
            <Eyelids
                {...props}
                transitionStyle={eyelidTransitionStyle}
                cornerShape={cornerShape}
            />
            <BlackFill {...props} leftX={props.eyeShape.leftX} />
        </svg>
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
