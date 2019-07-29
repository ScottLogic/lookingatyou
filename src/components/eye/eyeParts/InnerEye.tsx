import React, { useEffect, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { connect } from 'react-redux';
import tinycolor from 'tinycolor2';
import { IRootStore } from '../../../store/reducers/rootReducer';
import { IIrisAdjustment } from '../utils/EyeUtils';

interface IInnerEyeProps {
    irisRadius: number;
    innerY: number;
    innerX: number;
    irisColor: string;
    innerPath: any;
    pupilRadius: number;
    pupilColor: string;
    dilatedCoefficient: number;
    scleraRadius: number;
    width: number;
    height: number;
    reflection: ImageData | undefined;
    irisAdjustment: IIrisAdjustment;
}

interface IInnerEyeMapStateToProps {
    fps: number;
}

type InnerEyeProps = IInnerEyeProps & IInnerEyeMapStateToProps;

export const InnerEye = React.memo(
    (props: InnerEyeProps) => {
        const period = 1000 / props.fps;
        const transitionStyle = {
            transition: `transform ${period}ms`, // cx and cy transitions based on FPS
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
                transform={`
                    rotate(${props.irisAdjustment.angle})
                    scale(${props.irisAdjustment.scale}, 1)
                    rotate(${-props.irisAdjustment.angle})
                    translate(${props.innerX},${props.innerY})
                `}
            >
                <circle
                    className={'iris'}
                    r={props.irisRadius}
                    fill={'url(#irisGradient)'}
                />
                <path
                    className="irisStyling"
                    d={props.innerPath}
                    fill={tinycolor(props.irisColor)
                        .darken(10)
                        .toHexString()}
                />
                <g
                    className="pupil"
                    style={transitionStyle}
                    transform={`scale(${props.dilatedCoefficient})`}
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
                        fill={
                            props.reflection ? 'url(#pupilGradient)' : 'black'
                        }
                        stroke={'black'}
                        strokeWidth={'2'}
                    />
                </g>
                <ellipse
                    className={'innerReflection'}
                    rx={props.pupilRadius * 0.375}
                    ry={props.pupilRadius * 0.75}
                    fill={'url(#shineGradient)'}
                    transform={`skewX(30) translate(${
                        props.pupilRadius
                    },${-props.pupilRadius * 0.5})`}
                />
                <ellipse
                    className={'outerReflection'}
                    rx={props.pupilRadius * 0.5}
                    ry={props.pupilRadius}
                    fill={'url(#shineGradient)'}
                    transform={`skewX(30) translate(${
                        props.irisRadius
                    },${-props.irisRadius * 0.55})`}
                />
            </g>
        );
    },
    (previous, next) => isEqual(previous, next),
);

const mapStateToProps = (state: IRootStore): IInnerEyeMapStateToProps => ({
    fps: state.configStore.fps,
});

export default connect(mapStateToProps)(InnerEye);
