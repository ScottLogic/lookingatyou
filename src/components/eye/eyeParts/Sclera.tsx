import React from 'react';
import isEqual from 'react-fast-compare';

interface IScleraProps {
    style: any;
    radius: number;
    width: number;
    height: number;
}

export const Sclera = React.memo(
    (props: IScleraProps) => {
        return (
            <circle
                className={'sclera'}
                style={props.style}
                r={props.radius}
                fill={'url(#scleraGradient)'}
                cx={props.width}
                cy={props.height}
            />
        );
    },
    (previous, next) => isEqual(previous, next),
);
