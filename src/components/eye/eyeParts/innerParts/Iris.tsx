import React from 'react';
import tinycolor from 'tinycolor2';
import { IAnimationFrame } from '../../../../utils/pose/animations';
import { IInnerPartProps } from './IInnerPartsProps';

export interface IIrisProps extends IInnerPartProps {
    irisRadius: number;
    animation: IAnimationFrame;
    innerPath: any;
}

const Iris = React.memo((props: IIrisProps) => {
    return (
        <g {...props.groupProps}>
            <circle
                className={'iris'}
                r={props.irisRadius}
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
