import React from 'react';
import { connect } from 'react-redux';
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
    }

    componentDidUpdate() {
        if (this.props.videoIndex === 0 && this.props.selections.left) {
            this.bbox = this.props.selections.left;
        } else if (this.props.videoIndex === 1 && this.props.selections.right) {
            this.bbox = this.props.selections.right;
        }
        this.getStream();
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

        const focusedBbox = this.bbox;
        const detections =
            this.props.videoIndex === 0
                ? this.props.detections.left
                : this.props.detections.right;

        this.drawVideoFrame(video);

        if (this.props.selections && detections) {
            detections.forEach(({ bbox }) => {
                const [x, y, width, height] = bbox;
                const colour = bbox === focusedBbox ? 'green' : 'red';
                if (this.canvasRef.current) {
                    this.drawRectangle(colour, { x, y, width, height });
                }
            });
        }
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

    drawVideoFrame(image: HTMLVideoElement) {
        const canvas = this.canvasRef.current;
        if (canvas && image instanceof HTMLVideoElement) {
            canvas.height = image.height;
            canvas.width = image.width;

            const canvasCtx = canvas.getContext('2d');

            if (canvasCtx) {
                canvasCtx.drawImage(image, 0, 0, canvas.width, canvas.height);
            }
        }
    }

    drawRectangle(
        colour: string,
        bbox?: { x: number; y: number; width: number; height: number },
    ) {
        const canvas = this.canvasRef.current;
        if (canvas) {
            const canvasCtx = canvas.getContext('2d');
            if (canvasCtx && bbox) {
                canvasCtx.beginPath();
                canvasCtx.lineWidth = 5;
                canvasCtx.strokeStyle = colour;
                canvasCtx.rect(bbox.x, bbox.y, bbox.width, bbox.height);
                canvasCtx.stroke();
            }
        }
    }
}

export default connect(mapStateToProps)(CanvasMenuItem);
