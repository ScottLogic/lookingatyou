import React from 'react';
import isEqual from 'react-fast-compare';

interface IEyelidsProps {
    transitionStyle: { transition: string };
    eyeCoords: {
        leftX: number;
        rightX: number;
        middleY: number;
        middleX: number;
        topEyelidY: number;
        bottomEyelidY: number;
    };
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
    scleraRadius: number;
}

export const Eyelids = React.memo(
    (props: IEyelidsProps) => {
        return (
            <svg className="Eyelids">
                <path
                    style={props.transitionStyle}
                    filter="url(#shadowTop)"
                    d={
                        // upper eyelid
                        `M ${props.eyeCoords.leftX} ${props.eyeCoords.middleY},
                         A ${props.scleraRadius} ${props.scleraRadius} 0 0 1 ${
                            props.eyeCoords.rightX
                        } ${props.eyeCoords.middleY}
                         C ${props.eyeCoords.rightX -
                             props.cornerShape.rightTop *
                                 props.bezier.scaledXcontrolOffset} ${props
                            .eyeCoords.middleY -
                            props.bezier.scaledYcontrolOffset},
                         ${props.eyeCoords.middleX +
                             props.bezier.controlOffset} ${
                            props.eyeCoords.topEyelidY
                        }, ${props.eyeCoords.middleX} ${
                            props.eyeCoords.topEyelidY
                        }
                         C ${props.eyeCoords.middleX -
                             props.bezier.controlOffset} ${
                            props.eyeCoords.topEyelidY
                        }, ${props.eyeCoords.leftX +
                            props.cornerShape.leftTop *
                                props.bezier.scaledXcontrolOffset} ${props
                            .eyeCoords.middleY -
                            props.bezier.scaledYcontrolOffset}, ${
                            props.eyeCoords.leftX
                        } ${props.eyeCoords.middleY}`
                    }
                />
                <path
                    style={props.transitionStyle}
                    filter="url(#shadowBottom)"
                    d={
                        // lower eyelid
                        `M ${props.eyeCoords.leftX} ${props.eyeCoords.middleY},
                         A ${props.scleraRadius} ${props.scleraRadius} 0 0 0 ${
                            props.eyeCoords.rightX
                        } ${props.eyeCoords.middleY}
                         C ${props.eyeCoords.rightX -
                             props.cornerShape.rightBottom *
                                 props.bezier.scaledXcontrolOffset} ${props
                            .eyeCoords.middleY +
                            props.bezier.scaledYcontrolOffset},
                         ${props.eyeCoords.middleX +
                             props.bezier.controlOffset} ${
                            props.eyeCoords.bottomEyelidY
                        }, ${props.eyeCoords.middleX} ${
                            props.eyeCoords.bottomEyelidY
                        }
                         C ${props.eyeCoords.middleX -
                             props.bezier.controlOffset} ${
                            props.eyeCoords.bottomEyelidY
                        }, ${props.eyeCoords.leftX +
                            props.cornerShape.leftBottom *
                                props.bezier.scaledXcontrolOffset} ${props
                            .eyeCoords.middleY +
                            props.bezier.scaledYcontrolOffset}, ${
                            props.eyeCoords.leftX
                        } ${props.eyeCoords.middleY}`
                    }
                />
            </svg>
        );
    },
    (previous, next) => isEqual(previous, next),
);
