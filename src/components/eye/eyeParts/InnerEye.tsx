import React, { useEffect, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { connect } from 'react-redux';
import tinycolor from 'tinycolor2';
import { fisheyeConsts } from '../../../AppConstants';
import { IRootStore } from '../../../store/reducers/rootReducer';
import { getFPS } from '../../../store/selectors/configSelectors';
import { getTargets } from '../../../store/selectors/detectionSelectors';
import { getVideos } from '../../../store/selectors/videoSelectors';
import { normalise } from '../../../utils/objectTracking/calculateFocus';
import { ICoords } from '../../../utils/types';
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
    target: ICoords;
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
                    if (ctx && props.target) {
                        drawReflection(
                            ctx,
                            props.pupilRadius,
                            props.target,
                            props.image,
                        );
                    }
                }
            }
        }, [
            props.image,
            props.pupilRadius,
            props.target,
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
                        fill={
                            props.showReflection
                                ? 'url(#pupilGradient)'
                                : 'black'
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

function drawReflection(
    ctx: CanvasRenderingContext2D,
    radius: number,
    target: ICoords,
    image: HTMLVideoElement,
) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    const crop = getCrop(target, image);
    ctx.scale(-1, 1);
    ctx.filter = 'blur(1px)';
    const diameter = radius * 2;
    ctx.drawImage(
        image,
        crop.sx,
        crop.sy,
        crop.sWidth,
        crop.sHeight,
        0,
        0,
        -diameter,
        diameter,
    );
    const imgData = ctx.getImageData(0, 0, diameter, diameter);
    const result: Uint8ClampedArray = fisheye(imgData.data, diameter, diameter);
    imgData.data.set(result);
    ctx.putImageData(imgData, 0, 0);
    ctx.restore();
}

function fisheye(
    srcpixels: Uint8ClampedArray,
    width: number,
    height: number,
): Uint8ClampedArray {
    const dstpixels = new Uint8ClampedArray(srcpixels.length);

    for (let currRow = 0; currRow < height; currRow++) {
        const normalisedY = (2 * currRow) / height - 1; // a
        const normalYSquared = normalisedY * normalisedY; // a2

        for (let currColumn = 0; currColumn < width; currColumn++) {
            const normalisedX = (2 * currColumn) / width - 1; // b
            const normalXSquared = normalisedX * normalisedX; // b2

            const normalisedRadius = Math.sqrt(normalXSquared + normalYSquared); // c=sqrt(a2 + b2)

            // For any point in the circle
            if (0.0 <= normalisedRadius && normalisedRadius <= 1.0) {
                // The closer to the center it is, the larger the value
                let radiusScaling = Math.sqrt(
                    1.0 - normalisedRadius * normalisedRadius,
                );
                radiusScaling =
                    (normalisedRadius + (1.0 - radiusScaling)) / 2.0;
                // Exponential curve between 0 and 1, ie pixels closer to the center have a much lower scaling value

                radiusScaling =
                    radiusScaling * fisheyeConsts.intensity +
                    normalisedRadius * (1 - fisheyeConsts.intensity);

                const theta = Math.atan2(normalisedY, normalisedX); // angle to point from center of circle
                const scaledNormalisedX = radiusScaling * Math.cos(theta);
                const scaledNormalisedY = radiusScaling * Math.sin(theta);
                const newX = Math.floor(((scaledNormalisedX + 1) * width) / 2); // normalise x to size of circle
                const newY = Math.floor(((scaledNormalisedY + 1) * height) / 2); // normalise y to size of circle
                const srcpos = newY * width + newX; // New pixel position in array
                if (srcpos >= 0 && srcpos < width * height) {
                    for (let i = 0; i < 4; i++) {
                        dstpixels[
                            4 * Math.floor(currRow * width + currColumn) + i
                        ] = srcpixels[srcpos * 4 + i];
                    }
                }
            }
        }
    }
    return dstpixels;
}

function getCrop(target: ICoords, image: HTMLVideoElement) {
    const boxSize = image.width * 0.4;
    let sx = normalise(target.x, 1, -1, image.width, 0) - boxSize / 2;
    let sy = normalise(target.y, 1, -1, image.height, 0) - boxSize / 2;
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
}

const mapStateToProps = (state: IRootStore): IInnerEyeMapStateToProps => ({
    image: getVideos(state)[0],
    fps: getFPS(state),
    target: getTargets(state),
    showReflection: state.configStore.toggleReflection,
    reflectionOpacity: state.configStore.toggleReflection
        ? state.configStore.reflectionOpacity
        : 1,
});

export default connect(mapStateToProps)(InnerEye);
