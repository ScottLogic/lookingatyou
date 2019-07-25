import React, { useEffect, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { connect } from 'react-redux';
import tinycolor from 'tinycolor2';
import { IDetection } from '../../../models/objectDetection';
import { IRootStore } from '../../../store/reducers/rootReducer';
import { getSelections } from '../../../store/selectors/detectionSelectors';
import { getVideos } from '../../../store/selectors/videoSelectors';
import { Bbox } from '../../../utils/types';
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
    showReflection: boolean;
    selection: IDetection | undefined;
    reflectionOpacity: number;
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
            if (canvasRef && props.showReflection) {
                const canvas = canvasRef.current;
                if (canvas && props.image) {
                    const ctx = canvas.getContext('2d');
                    if (ctx && props.selection) {
                        drawReflection(
                            ctx,
                            props.pupilRadius,
                            props.selection.bbox,
                            props.image,
                        );
                    }
                }
            }
        }, [
            props.image,
            props.pupilRadius,
            props.selection,
            props.showReflection,
        ]);

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
                        {props.showReflection && (
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
    selection: Bbox,
    image: HTMLVideoElement,
) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    const sourceBox = getSourceBox(selection, image);
    ctx.scale(-1, 1);
    ctx.filter = 'blur(1px)';
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
    const imgData = ctx.getImageData(0, 0, radius * 2, radius * 2);
    const pixelsCopy = [];
    let index = 0;
    for (let i = 0; i <= imgData.data.length; i += 4) {
        pixelsCopy[index] = [
            imgData.data[i],
            imgData.data[i + 1],
            imgData.data[i + 2],
            imgData.data[i + 3],
        ];
        index++;
    }
    const result = fisheye(pixelsCopy, radius * 2, radius * 2);
    for (let i = 0; i < result.length; i++) {
        index = 4 * i;
        if (result[i] !== undefined) {
            imgData.data[index + 0] = result[i][0];
            imgData.data[index + 1] = result[i][1];
            imgData.data[index + 2] = result[i][2];
            imgData.data[index + 3] = result[i][3];
        }
    }
    ctx.putImageData(imgData, 0, 0);
    ctx.restore();
}

function fisheye(srcpixels: number[][], w: number, h: number) {
    const dstpixels = srcpixels.slice();

    for (let y = 0; y < h; y++) {
        const ny = (2 * y) / h - 1;
        const ny2 = ny * ny;

        for (let x = 0; x < w; x++) {
            const nx = (2 * x) / w - 1;
            const nx2 = nx * nx;
            const r = Math.sqrt(nx2 + ny2);

            if (0.0 <= r && r <= 1.0) {
                let nr = Math.sqrt(1.0 - r * r);
                nr = (r + (1.0 - nr)) / 2.0;

                if (nr <= 1.0) {
                    const theta = Math.atan2(ny, nx);
                    const nxn = nr * Math.cos(theta);
                    const nyn = nr * Math.sin(theta);
                    const x2 = Math.floor(((nxn + 1) * w) / 2);
                    const y2 = Math.floor(((nyn + 1) * h) / 2);
                    const srcpos = Math.floor(y2 * w + x2);
                    if (srcpos >= 0 && srcpos < w * h) {
                        dstpixels[Math.floor(y * w + x)] = srcpixels[srcpos];
                    }
                }
            }
        }
    }
    return dstpixels;
}

function getSourceBox(selection: Bbox, image: HTMLVideoElement) {
    if (selection) {
        const boxSize = image.width * 0.4;
        let sx = selection[0] + selection[2] / 2 - boxSize / 2;
        let sy = selection[1] + selection[3] / 2 - boxSize / 2;
        sx = Math.min(sx, image.width - boxSize);
        sx = Math.max(sx, 0);
        sy = Math.min(sy, image.height - boxSize);
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
            sWidth: 1,
            sHeight: 1,
        };
    }
}

const mapStateToProps = (state: IRootStore): IInnerEyeMapStateToProps => ({
    image: getVideos(state)[0],
    fps: state.configStore.config.fps,
    selection: getSelections(state),
    showReflection: state.configStore.config.toggleReflection,
    reflectionOpacity: state.configStore.config.toggleReflection
        ? state.configStore.config.reflectionOpacity
        : 1,
});

export default connect(mapStateToProps)(InnerEye);
