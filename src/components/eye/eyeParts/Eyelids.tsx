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
    width: number;
    height: number;
}

export const Eyelids = React.memo((props: IEyelidsProps) => {
    const { eyeShape, cornerShape, bezier, transitionStyle } = {
        ...props,
    };
    return (
        <svg className="Eyelids">
            <path
                style={transitionStyle}
                filter="url(#shadowTop)"
                d={
                    // upper eyelid
                    `M ${eyeShape.leftX} ${eyeShape.middleY}
                         H 0
                         V 0
                         H ${props.width}
                         V ${eyeShape.middleY}
                         H ${eyeShape.rightX}
                         C ${eyeShape.rightX -
                             cornerShape.rightTop *
                                 bezier.scaledXcontrolOffset} ${props.eyeShape
                        .middleY - bezier.scaledYcontrolOffset},
                         ${eyeShape.middleX + bezier.controlOffset} ${
                        eyeShape.topEyelidY
                    }, ${eyeShape.middleX} ${eyeShape.topEyelidY}
                         C ${eyeShape.middleX - bezier.controlOffset} ${
                        eyeShape.topEyelidY
                    }, ${eyeShape.leftX +
                        cornerShape.leftTop *
                            bezier.scaledXcontrolOffset} ${eyeShape.middleY -
                        bezier.scaledYcontrolOffset}, ${eyeShape.leftX} ${
                        eyeShape.middleY
                    }`
                }
            />
            <path
                style={transitionStyle}
                filter="url(#shadowBottom)"
                d={
                    // lower eyelid
                    `M ${eyeShape.leftX} ${eyeShape.middleY}
                         H 0
                         V ${props.height}
                         H ${props.width}
                         V ${eyeShape.middleY}
                         H ${eyeShape.rightX}
                         C ${eyeShape.rightX -
                             cornerShape.rightBottom *
                                 bezier.scaledXcontrolOffset} ${props.eyeShape
                        .middleY + bezier.scaledYcontrolOffset},
                         ${eyeShape.middleX + bezier.controlOffset} ${
                        eyeShape.bottomEyelidY
                    }, ${eyeShape.middleX} ${eyeShape.bottomEyelidY}
                         C ${eyeShape.middleX - bezier.controlOffset} ${
                        eyeShape.bottomEyelidY
                    }, ${eyeShape.leftX +
                        cornerShape.leftBottom *
                            bezier.scaledXcontrolOffset} ${eyeShape.middleY +
                        bezier.scaledYcontrolOffset}, ${eyeShape.leftX} ${
                        eyeShape.middleY
                    }`
                }
            />
        </svg>
    );
});
