import React from 'react';

export interface IEyelidsProps {
    transitionStyle: { transition: string };
    eyeShape: {
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

export const Eyelids = React.memo((props: IEyelidsProps) => {
    return (
        <svg className="Eyelids">
            <path
                style={props.transitionStyle}
                filter="url(#shadowTop)"
                d={
                    // upper eyelid
                    `M ${props.eyeShape.leftX} ${props.eyeShape.middleY},
                         A ${props.scleraRadius} ${props.scleraRadius} 0 0 1 ${
                        props.eyeShape.rightX
                    } ${props.eyeShape.middleY}
                         C ${props.eyeShape.rightX -
                             props.cornerShape.rightTop *
                                 props.bezier.scaledXcontrolOffset} ${props
                        .eyeShape.middleY - props.bezier.scaledYcontrolOffset},
                         ${props.eyeShape.middleX +
                             props.bezier.controlOffset} ${
                        props.eyeShape.topEyelidY
                    }, ${props.eyeShape.middleX} ${props.eyeShape.topEyelidY}
                         C ${props.eyeShape.middleX -
                             props.bezier.controlOffset} ${
                        props.eyeShape.topEyelidY
                    }, ${props.eyeShape.leftX +
                        props.cornerShape.leftTop *
                            props.bezier.scaledXcontrolOffset} ${props.eyeShape
                        .middleY - props.bezier.scaledYcontrolOffset}, ${
                        props.eyeShape.leftX
                    } ${props.eyeShape.middleY}`
                }
            />
            <path
                style={props.transitionStyle}
                filter="url(#shadowBottom)"
                d={
                    // lower eyelid
                    `M ${props.eyeShape.leftX} ${props.eyeShape.middleY},
                         A ${props.scleraRadius} ${props.scleraRadius} 0 0 0 ${
                        props.eyeShape.rightX
                    } ${props.eyeShape.middleY}
                         C ${props.eyeShape.rightX -
                             props.cornerShape.rightBottom *
                                 props.bezier.scaledXcontrolOffset} ${props
                        .eyeShape.middleY + props.bezier.scaledYcontrolOffset},
                         ${props.eyeShape.middleX +
                             props.bezier.controlOffset} ${
                        props.eyeShape.bottomEyelidY
                    }, ${props.eyeShape.middleX} ${props.eyeShape.bottomEyelidY}
                         C ${props.eyeShape.middleX -
                             props.bezier.controlOffset} ${
                        props.eyeShape.bottomEyelidY
                    }, ${props.eyeShape.leftX +
                        props.cornerShape.leftBottom *
                            props.bezier.scaledXcontrolOffset} ${props.eyeShape
                        .middleY + props.bezier.scaledYcontrolOffset}, ${
                        props.eyeShape.leftX
                    } ${props.eyeShape.middleY}`
                }
            />
        </svg>
    );
});
