import React from 'react';
import { EyeSide } from '../../AppConstants';
import { IAnimationFrame } from '../../utils/pose/animations';
import './Eye.css';
import { Eyelids } from './eyeParts/Eyelids';
import Iris from './eyeParts/innerParts/Iris';
import { Pupil } from './eyeParts/innerParts/Pupil';
import { Reflection } from './eyeParts/innerParts/Reflection';
import { Shines } from './eyeParts/innerParts/Shines';
import { Sclera } from './eyeParts/Sclera';
import { getCornerShape } from './utils/EyeShapeUtils';

export interface IEyeProps {
    animation: IAnimationFrame;
    class: EyeSide;
    innerPath: string;
    skewTransform: string;
    bezier: {
        controlOffset: number;
        scaledXcontrolOffset: number;
        scaledYcontrolOffset: number;
    };
    openCoefficient: number;
    reflectionOpacity: number;
    reflection?: ImageData;
}

export default function Eye(props: IEyeProps) {
    const cornerShape = getCornerShape(props.class);
    const eyelidTransitionStyle = {
        transition: `d ${props.animation.duration}ms`,
    };
    const transitionStyle = {
        transition: `transform ${props.animation.duration}ms`,
    };

    const innerProps = {
        className: 'inner',
        style: transitionStyle,
        transform: `${props.skewTransform} translate(${
            props.animation.target!.x
        },${props.animation.target!.y})`,
    };

    return (
        <div className={props.class}>
            <svg className="layer" viewBox={'-1, -1, 2, 2'}>
                <Sclera />
                <Iris
                    transitionStyle={transitionStyle}
                    animation={props.animation}
                    innerPath={props.innerPath}
                    groupProps={innerProps}
                />
            </svg>

            <svg className="layer" viewBox="-1, -1, 2, 2">
                <Reflection
                    transitionStyle={transitionStyle}
                    groupProps={innerProps}
                    animation={props.animation}
                    reflection={props.reflection}
                />
            </svg>

            <svg className="layer" viewBox={'-1, -1, 2, 2'}>
                <g {...innerProps}>
                    <Pupil
                        animation={props.animation}
                        transitionStyle={transitionStyle}
                        useGradient={props.reflection !== undefined}
                    />
                    <Shines />
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
