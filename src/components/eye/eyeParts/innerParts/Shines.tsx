import React from 'react';
import { eyeCoefficients } from '../../../../AppConstants';

export function Shines() {
    const pupilRadius = eyeCoefficients.pupil;
    const irisRadius = eyeCoefficients.iris;

    return (
        <g>
            <ellipse
                className={'innerShine'}
                rx={pupilRadius * 0.375}
                ry={pupilRadius * 0.75}
                fill={'url(#shineGradient)'}
                transform={`skewX(30) translate(${pupilRadius},${-pupilRadius *
                    0.5})`}
            />
            <ellipse
                className={'outerShine'}
                rx={pupilRadius * 0.5}
                ry={pupilRadius}
                fill={'url(#shineGradient)'}
                transform={`skewX(30) translate(${irisRadius},${-irisRadius *
                    0.55})`}
            />
        </g>
    );
}
