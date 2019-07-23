import { getAdjacentKeyPoints, Keypoint } from '@tensorflow-models/posenet';
import React from 'react';
import { connect } from 'react-redux';
import {
    canvasLineWidth,
    canvasScale,
    chosenTargetColour,
    minConfidence,
    nonChosenTargetColour,
} from '../../../AppConstants';
import { Detections, IDetection } from '../../../models/objectDetection';
import { IRootStore } from '../../../store/reducers/rootReducer';
import {
    getDetections,
    getSelections,
} from '../../../store/selectors/detectionSelectors';
import { getVideos } from '../../../store/selectors/videoSelectors';
import { HelpWith } from '../Help';

interface ITuple {
    y: number;
    x: number;
}

interface ICanvasMenuItemProps {
    name: string;
    helpWith: HelpWith;
    videoIndex: number;
}

interface IAppMapStateToProps {
    videos: Array<HTMLVideoElement | undefined>;
    selection: IDetection | undefined;
    detections: Detections;
}

type CanvasMenuItemProps = ICanvasMenuItemProps & IAppMapStateToProps;

export class CanvasMenuItem extends React.Component<CanvasMenuItemProps> {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    private keypoints: Keypoint[] = [];
    constructor(props: CanvasMenuItemProps) {
        super(props);

        this.state = {
            canvas: HTMLCanvasElement,
        };

        this.canvasRef = React.createRef();

        this.getStream = this.getStream.bind(this);
    }

    componentDidUpdate() {
        if (this.props.selection) {
            this.keypoints = this.props.selection.info.keypoints;
        }
        this.getStream();
    }

    shouldComponentUpdate(
        previousProps: CanvasMenuItemProps,
        nextProps: CanvasMenuItemProps,
    ) {
        return (
            previousProps.selection !== nextProps.selection ||
            previousProps.videoIndex !== nextProps.videoIndex
        );
    }

    getStream() {
        const video = this.props.videos[
            this.props.videoIndex
        ] as HTMLVideoElement;

        const focusedPose = this.keypoints;
        const detections = this.props.detections;

        this.handleDrawing(video, detections, focusedPose);
    }

    render() {
        return (
            <div data-tip={true} data-for={HelpWith[this.props.helpWith]}>
                <label>{this.props.name}</label>
                <br />
                <canvas id="canvas" ref={this.canvasRef} />
            </div>
        );
    }

    private handleDrawing(
        video: HTMLVideoElement,
        detections: IDetection[],
        focusedPose: Keypoint[],
    ) {
        if (this.canvasRef.current) {
            const canvas = this.canvasRef.current;
            canvas.height = video.height;
            canvas.width = video.width;
            const canvasCtx = canvas.getContext('2d');
            if (this.props.selection && detections && canvasCtx) {
                canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
                detections
                    .map(detection => detection.info.keypoints)
                    .forEach(keypointSet => {
                        drawPose(keypointSet, canvasCtx, nonChosenTargetColour);
                    });
                drawPose(focusedPose, canvasCtx, chosenTargetColour);
            }
        }
    }
}

function drawPose(
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
    ctx.lineWidth = canvasLineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
}

function drawSkeleton(
    keypoints: Keypoint[],
    canvasCtx: CanvasRenderingContext2D,
    colour: string,
) {
    const adjacentKeyPoints = getAdjacentKeyPoints(keypoints, minConfidence);

    adjacentKeyPoints.forEach(keypoint => {
        drawSegment(
            keypoint[0].position,
            keypoint[1].position,
            colour,
            canvasScale,
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
        if (keypoint.score >= minConfidence) {
            const { y, x } = keypoint.position;
            drawPoint(ctx, y * canvasScale, x * canvasScale, 3, colour);
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

const mapStateToProps = (state: IRootStore) => ({
    videos: getVideos(state),
    selection: getSelections(state),
    detections: getDetections(state),
});

export default connect(mapStateToProps)(CanvasMenuItem);
