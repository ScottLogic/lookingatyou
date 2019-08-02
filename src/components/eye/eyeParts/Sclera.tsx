import React from 'react';

export interface IScleraProps {
    radius: number;
    width: number;
    height: number;
}

export const Sclera = React.memo((props: IScleraProps) => {
    return (
        <circle
            className={'sclera'}
            r={props.radius}
            fill={'url(#scleraGradient)'}
            cx={props.width}
            cy={props.height}
        />
    );
});
