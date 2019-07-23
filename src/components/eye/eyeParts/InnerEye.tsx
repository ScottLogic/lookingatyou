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
        const transitionStyle = {
            transition: `transform ${period}ms`, // cx and cy transitions based on FPS
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
                        const r = props.pupilRadius;
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(r, r, r, 0, Math.PI * 2, true);
                        ctx.closePath();
                        ctx.clip();
                        ctx.drawImage(
                            props.image,
                            0,
                            0,
                            canvas.width,
                            canvas.height,
                        );
                        ctx.beginPath();
                        ctx.arc(0, 0, r, 0, Math.PI * 2, true);
                        ctx.clip();
                        ctx.closePath();
                        ctx.restore();
                    }
                }
            }
        });

        return (
            <g
                className="inner"
                style={transitionStyle}
                transform={`
                    rotate(${irisAdjustment.angle})
                    scale(${irisAdjustment.scale}, 1)
                    rotate(${-irisAdjustment.angle})
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
                    d={`M 0 0 ${props.innerPath}`}
                    fill={tinycolor(props.irisColor)
                        .darken(10)
                        .toHexString()}
                />
                <g
                    className="pupil"
                    style={transitionStyle}
                    transform={`scale(${props.dilatedCoefficient})`}
                >
                    <circle
                        className={'pupil'}
                        r={props.pupilRadius}
                        fill={props.pupilColor}
                    />
                    <foreignObject
                        width={props.pupilRadius * 2}
                        height={props.pupilRadius * 2}
                        x={-props.pupilRadius}
                        y={-props.pupilRadius}
                        opacity={0.15}
                    >
                        <canvas
                            ref={canvasRef}
                            width={props.pupilRadius * 2}
                            height={props.pupilRadius * 2}
                        />
                    </foreignObject>
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
    image: getVideos(state)[0],
    fps: state.configStore.config.fps,
});

export default connect(mapStateToProps)(InnerEye);
