import { Keypoint } from '@tensorflow-models/posenet';
import React from 'react';
import { connect } from 'react-redux';
import {
    chosenTargetColour,
    nonChosenTargetColour,
} from '../../../AppConstants';
import { Detections, IDetection } from '../../../models/objectDetection';
import { IRootStore } from '../../../store/reducers/rootReducer';
import {
    getDetections,
    getSelections,
} from '../../../store/selectors/detectionSelectors';
import { getVideos } from '../../../store/selectors/videoSelectors';
import { drawPose } from '../DrawPoseUtils';
import { HelpWith } from '../Help';

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

            if (canvasCtx) {
                canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            }

            this.drawVideo(canvasCtx, video, canvas);

            this.drawPoses(detections, canvasCtx, focusedPose);
        }
    }

    private drawPoses(
        detections: IDetection[],
        canvasCtx: CanvasRenderingContext2D | null,
        focusedPose: Keypoint[],
    ) {
        if (this.props.selection && detections && canvasCtx) {
            detections
                .map(detection => detection.info.keypoints)
                .forEach(keypointSet => {
                    if (noMatchingPoint(keypointSet, this.keypoints)) {
                        drawPose(keypointSet, canvasCtx, nonChosenTargetColour);
                    }
                });
            drawPose(focusedPose, canvasCtx, chosenTargetColour);
        }
    }

    private drawVideo(
        canvasCtx: CanvasRenderingContext2D | null,
        video: HTMLVideoElement,
        canvas: HTMLCanvasElement,
    ) {
        if (canvasCtx) {
            canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
    }
}

function noMatchingPoint(keypoints1: Keypoint[], keypoints2: Keypoint[]) {
    for (const point1 of keypoints1) {
        for (const point2 of keypoints2) {
            if (
                point1.position.x === point2.position.x &&
                point1.position.y === point2.position.y
            ) {
                return false;
            }
        }
    }
    return true;
}

const mapStateToProps = (state: IRootStore) => ({
    videos: getVideos(state),
    selection: getSelections(state),
    detections: getDetections(state),
});

export default connect(mapStateToProps)(CanvasMenuItem);
