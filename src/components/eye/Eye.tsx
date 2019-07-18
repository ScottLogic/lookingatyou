import React, { useEffect, useState } from 'react';
import { EyeSide, transitionTime } from '../../AppConstants';
import './Eye.css';
import { BlackFill } from './eyeParts/BlackFill';
import { Eyelids } from './eyeParts/Eyelids';
import { InnerEye } from './eyeParts/InnerEye';
import { Sclera } from './eyeParts/Sclera';
import { getInnerPath } from './getInnerPath';

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
    bezier: {
        controlOffset: number;
        scaledXcontrolOffset: number;
        scaledYcontrolOffset: number;
    };
    eyeCoords: {
        leftX: number;
        rightX: number;
        middleY: number;
        middleX: number;
        topEyelidY: number;
        bottomEyelidY: number;
    };
}

const pupilColor = 'black';

export default function Eye(props: IEyeProps) {
    const circleTransitionStyle = {
        transition: `r ${transitionTime.dilate}ms, cx ${1000 /
            props.fps}ms, cy ${1000 / props.fps}ms,
            transform ${1000 / props.fps}ms`, // cx and cy transitions based on FPS
    };
    const ellipseTransitionStyle = {
        transition: `rx ${transitionTime.dilate}ms, ry ${
            transitionTime.dilate
        }ms, cx ${1000 / props.fps}ms, cy ${1000 /
            props.fps}ms, transform ${1000 / props.fps}ms`, // cx and cy transitions based on FPS
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
    const cornerShape = getCornerShape(props);

    const scaledResolution = props.width / 960;
    const [innerPath, setInnerPath] = useState(getInnerPath(scaledResolution));

    useEffect(() => {
        console.log('path');
        setInnerPath(getInnerPath(scaledResolution));
    }, [innerPath]);

    return (
        <svg className={props.class} width={props.width} height={props.height}>
            <Sclera
                style={circleTransitionStyle}
                radius={props.scleraRadius}
                width={props.width / 2}
                height={props.height / 2}
            />
            <InnerEye
                innerTransitionStyle={innerTransitionStyle}
                circleTransitionStyle={circleTransitionStyle}
                lineTransitionStyle={lineTransitionStyle}
                ellipseTransitionStyle={ellipseTransitionStyle}
                irisRadius={props.irisRadius}
                irisColor={props.irisColor}
                innerY={props.innerY}
                innerX={props.innerX}
                innerPath={innerPath}
                pupilRadius={props.pupilRadius}
                pupilColor={pupilColor}
                dilatedCoefficient={props.dilatedCoefficient}
                scleraRadius={props.scleraRadius}
                width={props.width}
                height={props.height}
            />
            <Eyelids
                transitionStyle={eyelidTransitionStyle}
                eyeCoords={props.eyeCoords}
                cornerShape={cornerShape}
                bezier={props.bezier}
                scleraRadius={props.scleraRadius}
            />
            <BlackFill
                eyeCoords={props.eyeCoords}
                scleraRadius={props.scleraRadius}
                height={props.height}
                width={props.width}
            />
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
