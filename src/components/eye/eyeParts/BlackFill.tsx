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
                         L ${props.eyeCoords.leftX} ${props.eyeCoords.middleY},
                         A ${props.scleraRadius} ${props.scleraRadius} 0 0 1 ${props.eyeCoords.rightX} ${props.eyeCoords.middleY}
                         L ${props.width} ${props.eyeCoords.middleY},
                         L ${props.width} 0
                         L 0 0`}
                />
                <path
                    d={`M 0 ${props.eyeCoords.middleY},
                         L ${props.eyeCoords.leftX} ${props.eyeCoords.middleY},
                         A ${props.scleraRadius} ${props.scleraRadius} 0 0 0 ${props.eyeCoords.rightX} ${props.eyeCoords.middleY}
                         L ${props.width} ${props.eyeCoords.middleY},
                         L ${props.width} ${props.height}
                         L 0 ${props.height}`}
                />
            </svg>
        );
    },
    (previous, next) => isEqual(previous, next),
);
