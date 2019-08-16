import React from 'react';
import { IAnimationFrame } from '../../../../utils/pose/animations';

interface IPupilProps {
    pupilRadius: number;
    useGradient: boolean;
    transitionStyle: React.CSSProperties;
    animation: IAnimationFrame;
}

export function Pupil(props: IPupilProps) {
    return (
        <circle
            className={'pupil'}
            r={props.pupilRadius}
            fill={props.useGradient ? 'url(#pupilGradient)' : 'black'}
            stroke={'black'}
            strokeWidth={'2'}
            style={props.transitionStyle}
            transform={`scale(${props.animation.dilation})`}
        />
    );
}
