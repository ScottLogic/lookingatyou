import React, { useEffect, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { connect } from 'react-redux';
import tinycolor from 'tinycolor2';
import { ISelections } from '../../../models/objectDetection';
import { IRootStore } from '../../../store/reducers/rootReducer';
import { getSelections } from '../../../store/selectors/detectionSelectors';
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
    selection: ISelections;
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

        useEffect(() => {
            irisAdjustmentRef.current = irisAdjustment;
        }, [irisAdjustment]);

        useEffect(() => {
            if (canvasRef) {
                const canvas = canvasRef.current;
                if (canvas && props.image) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        drawReflection(
                            ctx,
                            props.pupilRadius,
                            props.selection,
                            props.image,
                        );
                    }
                }
            }
        }, [props.image, props.pupilRadius, props.selection]);

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
                    <foreignObject
                        width={props.pupilRadius * 2}
                        height={props.pupilRadius * 2}
                        x={-props.pupilRadius}
                        y={-props.pupilRadius}
                    >
                        <canvas
                            ref={canvasRef}
                            width={props.pupilRadius * 2}
                            height={props.pupilRadius * 2}
                        />
                    </foreignObject>
                    <circle
                        className={'pupil'}
                        r={props.pupilRadius}
                        fill={'url(#pupilGradient)'}
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

function drawReflection(
    ctx: CanvasRenderingContext2D,
    radius: number,
    selection: ISelections,
    image: HTMLVideoElement,
) {
    const r = radius;
    ctx.save();
    ctx.beginPath();
    ctx.arc(r, r, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.scale(-1, 1);
    const sourceBox = getSourceBox(selection, image);
    ctx.drawImage(
        image,
        sourceBox.sx,
        sourceBox.sy,
        sourceBox.sWidth,
        sourceBox.sHeight,
        0,
        0,
        -radius * 2,
        radius * 2,
    );
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2, true);
    ctx.clip();
    ctx.closePath();
    ctx.restore();
}

function getSourceBox(selection: ISelections, image: HTMLVideoElement) {
    if (selection.left) {
        const boxSize = image.width * 0.4;
        let sx = selection.left[0] + selection.left[2] / 2 - boxSize / 2;
        let sy = selection.left[1] + selection.left[3] / 2 - boxSize / 2;
        sx = Math.min(sx, image.width - boxSize);
        sx = Math.max(sx, 0);
        sy = Math.min(sy, image.width - boxSize);
        sy = Math.max(sy, 0);
        return {
            sx,
            sy,
            sWidth: boxSize,
            sHeight: boxSize,
        };
    } else {
        return {
            sx: 0,
            sy: 0,
            sWidth: 0,
            sHeight: 0,
        };
    }
}

const mapStateToProps = (state: IRootStore): IInnerEyeMapStateToProps => ({
    image: getVideos(state)[0],
    fps: state.configStore.config.fps,
    selection: getSelections(state),
});

export default connect(mapStateToProps)(InnerEye);
