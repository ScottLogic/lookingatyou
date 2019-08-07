import React, { useEffect, useRef } from 'react';
import tinycolor from 'tinycolor2';
import { IAnimationFrame } from '../../../utils/pose/animations';

interface IInnerEyeProps {
    irisRadius: number;
    animation: IAnimationFrame;
    innerPath: any;
    pupilRadius: number;
    scleraRadius: number;
    width: number;
    height: number;
    skewTransform: string;
    reflection?: ImageData;
}

export const InnerEye = React.memo((props: IInnerEyeProps) => {
    const transitionStyle = {
        transition: `transform ${props.animation.duration}ms`,
    };
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

    return (
        <g
            className="inner"
            style={transitionStyle}
            transform={`${props.skewTransform} translate(${
                props.animation.target!.x
            },${props.animation.target!.y})`}
        >
            <circle
                className={'iris'}
                r={props.irisRadius}
                fill={'url(#irisGradient)'}
            />
            <path
                className="irisStyling"
                d={props.innerPath}
                fill={tinycolor(props.animation!.irisColor)
                    .darken(10)
                    .toHexString()}
            />
            <g
                className="pupil"
                style={transitionStyle}
                transform={`scale(${props.animation!.dilation})`}
            >
                <foreignObject
                    width={props.pupilRadius * 2}
                    height={props.pupilRadius * 2}
                    x={-props.pupilRadius}
                    y={-props.pupilRadius}
                >
                    {props.reflection && (
                        <canvas
                            ref={canvasRef}
                            width={props.pupilRadius * 2}
                            height={props.pupilRadius * 2}
                        />
                    )}
                </foreignObject>
                <circle
                    className={'pupil'}
                    r={props.pupilRadius}
                    fill={props.reflection ? 'url(#pupilGradient)' : 'black'}
                    stroke={'black'}
                    strokeWidth={'2'}
                />
            </g>
            <ellipse
                className={'innerShine'}
                rx={props.pupilRadius * 0.375}
                ry={props.pupilRadius * 0.75}
                fill={'url(#shineGradient)'}
                transform={`skewX(30) translate(${
                    props.pupilRadius
                },${-props.pupilRadius * 0.5})`}
            />
            <ellipse
                className={'outerShine'}
                rx={props.pupilRadius * 0.5}
                ry={props.pupilRadius}
                fill={'url(#shineGradient)'}
                transform={`skewX(30) translate(${
                    props.irisRadius
                },${-props.irisRadius * 0.55})`}
            />
        </g>
    );
});

export default InnerEye;
