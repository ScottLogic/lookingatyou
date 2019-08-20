import React from 'react';
import { eyeCoefficients } from '../../../../AppConstants';
import { IAnimationFrame } from '../../../../utils/pose/animations';

interface IPupilProps {
    useGradient: boolean;
    transitionStyle: React.CSSProperties;
    animation: IAnimationFrame;
}

export function Pupil(props: IPupilProps) {
    const pupilRadius = eyeCoefficients.pupil;
    return (
        <circle
            className={'pupil'}
            r={pupilRadius}
            fill={props.useGradient ? 'url(#pupilGradient)' : 'black'}
            style={props.transitionStyle}
            transform={`scale(${props.animation.dilation})`}
        />
    );
}
