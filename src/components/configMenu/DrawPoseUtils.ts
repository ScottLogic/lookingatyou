import { getAdjacentKeyPoints, Keypoint } from '@tensorflow-models/posenet';
import { debugFeedConsts } from '../../AppConstants';

interface ITuple {
    y: number;
    x: number;
}

export function drawPose(
    keypoints: Keypoint[],
    canvasCtx: CanvasRenderingContext2D,
    colour: string,
) {
    drawSkeleton(keypoints, canvasCtx, colour);
    drawKeypoints(keypoints, canvasCtx, colour);
}

function drawSegment(
    pair1: ITuple,
    pair2: ITuple,
    color: string,
    scale: number,
    ctx: CanvasRenderingContext2D,
) {
    ctx.beginPath();
    ctx.moveTo(pair1.x * scale, pair1.y * scale);
    ctx.lineTo(pair2.x * scale, pair2.y * scale);
    ctx.lineWidth = debugFeedConsts.lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
}

function drawSkeleton(
    keypoints: Keypoint[],
    canvasCtx: CanvasRenderingContext2D,
    colour: string,
) {
    const adjacentKeyPoints = getAdjacentKeyPoints(
        keypoints,
        debugFeedConsts.minConfidence,
    );

    adjacentKeyPoints.forEach(keypoint => {
        drawSegment(
            keypoint[0].position,
            keypoint[1].position,
            colour,
            debugFeedConsts.canvasScale,
            canvasCtx,
        );
    });
}

function drawKeypoints(
    keypoints: Keypoint[],
    ctx: CanvasRenderingContext2D,
    colour: string,
) {
    for (const keypoint of keypoints) {
        if (keypoint.score >= debugFeedConsts.minConfidence) {
            const { y, x } = keypoint.position;
            drawPoint(
                ctx,
                y * debugFeedConsts.canvasScale,
                x * debugFeedConsts.canvasScale,
                debugFeedConsts.pointRadius,
                colour,
            );
        }
    }
}

function drawPoint(
    ctx: CanvasRenderingContext2D,
    y: number,
    x: number,
    r: number,
    colour: string,
) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = colour;
    ctx.fill();
}
