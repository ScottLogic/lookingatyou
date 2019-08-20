import React from 'react';
import tinycolor from 'tinycolor2';
import { eyeCoefficients } from '../../../../AppConstants';
import { IAnimationFrame } from '../../../../utils/pose/animations';
import { IInnerPartProps } from '../../types';

export interface IIrisProps extends IInnerPartProps {
    animation: IAnimationFrame;
    innerPath: string;
}

const Iris = React.memo((props: IIrisProps) => {
    return (
        <g {...props.groupProps}>
            <circle
                className={'iris'}
                r={eyeCoefficients.iris}
                fill={'url(#irisGradient)'}
            />
            <path
                className="irisStyling"
                d={props.innerPath}
                fill={tinycolor(props.animation.irisColor)
                    .darken(10)
                    .toHexString()}
            />
        </g>
    );
});
export default Iris;
