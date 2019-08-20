import React, { useEffect, useRef } from 'react';
import { eyeCoefficients } from '../../../../AppConstants';
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

    let size = 256;
    if (props.reflection) {
        size = props.reflection.width;
    }
    let scale = (eyeCoefficients.pupil * 2) / size;
    if (props.animation.dilation) {
        scale *= props.animation.dilation;
    }

    return (
        <g {...props.groupProps}>
            <foreignObject
                width={size}
                height={size}
                x={-size / 2}
                y={-size / 2}
                style={props.transitionStyle}
                transform={`scale(${scale})`}
            >
                {props.reflection && (
                    <canvas ref={canvasRef} width={size} height={size} />
                )}
            </foreignObject>
        </g>
    );
}
