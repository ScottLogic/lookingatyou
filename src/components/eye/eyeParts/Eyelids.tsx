import React from 'react';
import { eyeCoefficients } from '../../../AppConstants';
import '../Eye.css';

export interface IEyelidsProps {
    transitionStyle: { transition: string };
    cornerShape: {
        leftTop: number;
        rightTop: number;
        leftBottom: number;
        rightBottom: number;
    };
    bezier: {
        controlOffset: number;
        scaledXcontrolOffset: number;
        scaledYcontrolOffset: number;
    };
    openCoefficient: number;
}

export const Eyelids = React.memo((props: IEyelidsProps) => {
    const bezier = props.bezier;
    const scleraRadius = eyeCoefficients.sclera;
    const eyeHeight = scleraRadius * props.openCoefficient;

    function renderEyelid(isTop: boolean) {
        const filter = `url(#shadow${isTop ? 'Top' : 'Bottom'})`;
        const sign = isTop ? -1 : 1;
        const shape = isTop
            ? {
                  right: props.cornerShape.rightTop,
                  left: props.cornerShape.leftTop,
              }
            : {
                  right: props.cornerShape.rightBottom,
                  left: props.cornerShape.leftBottom,
              };

        return (
            <path
                style={props.transitionStyle}
                filter={filter}
                d={`M -1 0 
                    V ${sign}
                    H 1
                    V 0
                    H ${scleraRadius}
                    C ${scleraRadius -
                        bezier.scaledXcontrolOffset * shape.right}
                        ${sign * bezier.scaledYcontrolOffset}
                        ${bezier.controlOffset}
                        ${sign * eyeHeight}
                        0
                        ${sign * eyeHeight}
                    S ${-scleraRadius +
                        bezier.scaledXcontrolOffset * shape.left}
                        ${sign * bezier.scaledYcontrolOffset}
                        ${-scleraRadius}
                        0
                    Z`}
            />
        );
    }

    return (
        <>
            {renderEyelid(true)}
            {renderEyelid(false)}
        </>
    );
});
