import React from 'react';
import { connect } from 'react-redux';
import { tooCloseDistance } from '../../../AppConstants';
import { IDetections, ISelections } from '../../../models/objectDetection';
import { IRootStore } from '../../../store/reducers/rootReducer';
import {
    getDetections,
    getSelections,
} from '../../../store/selectors/detectionSelectors';
import { getVideos } from '../../../store/selectors/videoSelectors';
import { Bbox } from '../../../utils/types';
import { HelpWith } from '../Help';

interface ICanvasMenuItemProps {
    name: string;
    helpWith: HelpWith;
    videoIndex: number;
}

interface IAppMapStateToProps {
    videos: Array<HTMLVideoElement | undefined>;
    selections: ISelections;
    detections: IDetections;
}

type CanvasMenuItemProps = ICanvasMenuItemProps & IAppMapStateToProps;

const mapStateToProps = (state: IRootStore) => {
    return {
        videos: getVideos(state),
        selections: getSelections(state),
        detections: getDetections(state),
    };
};

export class CanvasMenuItem extends React.Component<CanvasMenuItemProps> {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    private bbox: Bbox = [0, 0, 0, 0];
    constructor(props: CanvasMenuItemProps) {
        super(props);

        this.state = {
            canvas: HTMLCanvasElement,
        };

        this.canvasRef = React.createRef();

        this.getStream = this.getStream.bind(this);
        this.closeToChosenTarget = this.closeToChosenTarget.bind(this);
    }

    componentDidUpdate() {
        this.getStream();
        if (this.props.videoIndex === 0) {
            this.bbox = this.props.selections.left;
        } else if (this.props.videoIndex === 1 && this.props.selections.right) {
            this.bbox = this.props.selections.right;
        }
    }

    shouldComponentUpdate(
        previousProps: CanvasMenuItemProps,
        nextProps: CanvasMenuItemProps,
    ) {
        return (
            previousProps.selections !== nextProps.selections ||
            previousProps.name !== nextProps.name ||
            previousProps.videoIndex !== nextProps.videoIndex
        );
    }

    getStream() {
        const video = this.props.videos[
            this.props.videoIndex
        ] as HTMLVideoElement;

        const detections =
            this.props.videoIndex === 0
                ? this.props.detections.left
                : this.props.detections.right;

        if (this.props.selections && detections) {
            let [x, y, width, height] = this.bbox;
            let bbox = { x, y, width, height };
            this.drawImage(video, 'red', bbox);

            detections.forEach(detection => {
                if (!this.closeToChosenTarget(detection.bbox)) {
                    [x, y, width, height] = detection.bbox;
                    bbox = { x, y, width, height };
                    if (this.canvasRef.current) {
                        this.drawImage(this.canvasRef.current, 'blue', bbox);
                    }
                }
            });
        }
    }

    closeToChosenTarget(bbox: Bbox) {
        const [x, y, width, height] = bbox;
        const [chosenX, chosenY, chosenWidth, chosenHeight] = this.bbox;
        return (
            areCoordinatesClose(x, chosenX) &&
            areCoordinatesClose(y, chosenY) &&
            areCoordinatesClose(width, chosenWidth) &&
            areCoordinatesClose(height, chosenHeight)
        );
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

    drawImage(
        image: CanvasImageSource,
        colour: string,
        bbox?: { x: number; y: number; width: number; height: number },
    ) {
        const canvas = this.canvasRef.current;
        if (canvas) {
            if (image instanceof HTMLVideoElement) {
                canvas.height = image.height;
                canvas.width = image.width;
            }
            const canvasCtx = canvas.getContext('2d');

            if (canvasCtx) {
                if (image instanceof HTMLVideoElement) {
                    canvasCtx.drawImage(
                        image,
                        0,
                        0,
                        canvas.width,
                        canvas.height,
                    );
                }
                if (bbox !== undefined) {
                    canvasCtx.beginPath();
                    canvasCtx.lineWidth = 5;
                    canvasCtx.strokeStyle = colour;
                    canvasCtx.rect(bbox.x, bbox.y, bbox.width, bbox.height);
                    canvasCtx.stroke();
                }
            }
        }
    }
}

function areCoordinatesClose(point1: number, point2: number): boolean {
    return Math.abs(point1 - point2) < tooCloseDistance;
}

export default connect(mapStateToProps)(CanvasMenuItem);
