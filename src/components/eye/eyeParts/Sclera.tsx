import React from 'react';
import isEqual from 'react-fast-compare';

interface IScleraProps {
    radius: number;
    width: number;
    height: number;
}

export const Sclera = React.memo(
    (props: IScleraProps) => {
        return (
            <circle
                className={'sclera'}
                r={props.radius}
                fill={'url(#scleraGradient)'}
                cx={props.width / 2}
                cy={props.height}
            />
        );
    },
    (previous, next) => isEqual(previous, next),
);
