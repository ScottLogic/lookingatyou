import React, { useEffect, useRef } from 'react';
import { IAnimationFrame } from '../../../../utils/pose/animations';
import { IInnerPartProps } from '../../types';
interface IReflectionProps extends IInnerPartProps {
    animation: IAnimationFrame;
    reflection?: ImageData;
}
export function Reflection(props: IReflectionProps) {
    const canvasRef: React.RefObject<HTMLCanvasElement> = useRef(null);

    useEffect(() => {
        if (canvasRef && props.reflection) {
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.putImageData(props.reflection, 0, 0);
                }
            }
        }
    }, [props.reflection]);

    return props.reflection ? (
        <g {...props.groupProps}>
            <foreignObject
                width={props.pupilRadius * 2}
                height={props.pupilRadius * 2}
                x={-props.pupilRadius}
                y={-props.pupilRadius}
                style={props.transitionStyle}
                transform={`scale(${props.animation.dilation})`}
            >
                <canvas
                    ref={canvasRef}
                    width={props.pupilRadius * 2}
                    height={props.pupilRadius * 2}
                />
            </foreignObject>
        </g>
    ) : null;
}
