import React from 'react';

export interface IBlackFillProps {
    leftX: number;
    scleraRadius: number;
    width: number;
    height: number;
}

export const BlackFill = React.memo((props: IBlackFillProps) => {
    return (
        <svg className="BlackFill">
            <path
                d={`M 0 ${props.height / 2},
                         H ${props.leftX},
                         A ${props.scleraRadius} ${props.scleraRadius} 0 1 1 ${
                    props.leftX
                } ${props.height / 2 + 1}
                         v -1
                         H 0
                         V 0
                         H ${props.width}
                         V ${props.height}
                         H 0
                         Z`}
            />
        </svg>
    );
});
