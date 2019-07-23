import React, { useEffect, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { connect } from 'react-redux';
import tinycolor from 'tinycolor2';
import { IRootStore } from '../../../store/reducers/rootReducer';
import { getVideos } from '../../../store/selectors/videoSelectors';
import { getIrisAdjustment } from '../EyeUtils';

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
}

interface IInnerEyeMapStateToProps {
    image: HTMLVideoElement | undefined;
    fps: number;
}

type InnerEyeProps = IInnerEyeProps & IInnerEyeMapStateToProps;

export const InnerEye = React.memo(
    (props: InnerEyeProps) => {
        const period = 1000 / props.fps;
        const pupilTransitionStyle = {
            transition: `r ${period}ms linear, transform ${period}ms`, // cx and cy transitions based on FPS
        };
        const innerTransitionStyle = {
            transition: `transform ${period}ms, x ${period}ms, y ${period}ms`,
        };
        const imageTransitionStyle = {
            transition: `width ${period}ms linear, height ${period}ms linear`,
        };
        const irisAdjustmentRef = useRef({ scale: 1, angle: 0 });
        const canvasRef: React.RefObject<HTMLCanvasElement> = useRef(null);
        const irisAdjustment = getIrisAdjustment(
            props.innerX,
            props.innerY,
            props.height,
            props.width,
            props.scleraRadius,
            props.irisRadius,
            irisAdjustmentRef.current.angle,
        );
        const dilatedPupilRadius = props.pupilRadius * props.dilatedCoefficient;

        useEffect(() => {
            irisAdjustmentRef.current = irisAdjustment;
        }, [irisAdjustment]);

        useEffect(() => {
            if (canvasRef) {
                const canvas = canvasRef.current;
                if (canvas && props.image) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        const radius =
                            props.pupilRadius * props.dilatedCoefficient;
                        const diameter = radius * 2;
                        ctx.drawImage(props.image, 0, 0, diameter, diameter);
                        ctx.globalCompositeOperation = 'destination-in';
                        ctx.beginPath();
                        ctx.arc(radius, radius, radius, 0, Math.PI * 2);
                        ctx.closePath();
                        ctx.fill();
                    }
                }
            }
        });

        return (
            <g
                className="inner"
                style={innerTransitionStyle}
                transform={`
                    rotate(${irisAdjustment.angle})
                    scale(${irisAdjustment.scale}, 1)
                    rotate(${-irisAdjustment.angle})
                    translate(${props.innerX},${props.innerY})
                `}
                x={props.innerX}
                y={props.innerY}
            >
                <circle
                    className={'iris'}
                    r={props.irisRadius}
                    fill={'url(#irisGradient)'}
                />
                <path
                    className="irisStyling"
                    d={`M 0 0 ${props.innerPath}`}
                    fill={tinycolor(props.irisColor)
                        .darken(10)
                        .toHexString()}
                />
                <g className="pupil" style={pupilTransitionStyle}>
                    <circle
                        className={'pupil'}
                        r={props.pupilRadius * props.dilatedCoefficient}
                        fill={props.pupilColor}
                    />
                    <foreignObject
                        width={dilatedPupilRadius * 2}
                        height={dilatedPupilRadius * 2}
                        x={-dilatedPupilRadius}
                        y={-dilatedPupilRadius}
                        style={{
                            ...imageTransitionStyle,
                            marginLeft: `-${dilatedPupilRadius}`,
                            marginTop: `-${dilatedPupilRadius}`,
                            padding: `0px`,
                        }}
                        opacity={0.15}
                    >
                        <canvas
                            ref={canvasRef}
                            style={{
                                ...imageTransitionStyle,
                            }}
                            width={dilatedPupilRadius * 2}
                            height={dilatedPupilRadius * 2}
                        />
                    </foreignObject>
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
            </g>
        );
    },
    (previous, next) => isEqual(previous, next),
);

const mapStateToProps = (state: IRootStore): IInnerEyeMapStateToProps => ({
    image: getVideos(state)[0],
    fps: state.configStore.config.fps,
});

export default connect(mapStateToProps)(InnerEye);
