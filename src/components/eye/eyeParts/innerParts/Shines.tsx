import React from 'react';
import { IAnimationFrame } from '../../../../utils/pose/animations';
import { IInnerPartProps } from '../../types';

interface IShineProps extends IInnerPartProps {
    irisRadius: number;
    animation: IAnimationFrame;
}

export function Shines(props: IShineProps) {
    return (
        <g>
            <ellipse
                className={'innerShine'}
                rx={props.pupilRadius * 0.375}
                ry={props.pupilRadius * 0.75}
                fill={'url(#shineGradient)'}
                transform={`skewX(30) translate(${
                    props.pupilRadius
                },${-props.pupilRadius * 0.5})`}
            />
            <ellipse
                className={'outerShine'}
                rx={props.pupilRadius * 0.5}
                ry={props.pupilRadius}
                fill={'url(#shineGradient)'}
                transform={`skewX(30) translate(${
                    props.irisRadius
                },${-props.irisRadius * 0.55})`}
            />
        </g>
    );
}
