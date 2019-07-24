import React from 'react';
import isEqual from 'react-fast-compare';

interface IBlackFillProps {
    eyeCoords: {
        leftX: number;
        rightX: number;
        middleY: number;
        middleX: number;
        topEyelidY: number;
        bottomEyelidY: number;
    };
    scleraRadius: number;
    width: number;
    height: number;
}

export const BlackFill = React.memo(
    (props: IBlackFillProps) => {
        return (
            <svg className="BlackFill">
                <path
                    d={`M 0 ${props.eyeCoords.middleY},
                         H ${props.eyeCoords.leftX},
                         A ${props.scleraRadius} ${props.scleraRadius} 0 0 1 ${props.eyeCoords.rightX} ${props.eyeCoords.middleY}
                         A ${props.scleraRadius} ${props.scleraRadius} 0 1 1 ${props.eyeCoords.leftX} ${props.eyeCoords.middleY}
                         H 0
                         V 0
                         H ${props.width}
                         V ${props.height}
                         H 0
                         Z`}
                />
            </svg>
        );
    },
    (previous, next) => isEqual(previous, next),
);
