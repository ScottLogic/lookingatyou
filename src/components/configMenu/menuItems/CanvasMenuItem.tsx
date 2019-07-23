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
import { Bbox } from '../../../utils/types';
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
        if (this.props.selection) {
            this.bbox = this.props.selection.bbox;
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

        const focusedBbox = this.bbox;
        const detections = this.props.detections;

        this.drawVideoFrame(video);

        let [x, y, width, height] = [0, 0, 0, 0];

        if (this.props.selection && detections) {
            detections.forEach(({ bbox }) => {
                [x, y, width, height] = bbox;
                if (this.canvasRef.current) {
                    this.drawRectangle(nonChosenTargetColour, {
                        x,
                        y,
                        width,
                        height,
                    });
                }
            });
        }

        [x, y, width, height] = focusedBbox;
        this.drawRectangle(chosenTargetColour, { x, y, width, height });
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

const mapStateToProps = (state: IRootStore) => ({
    videos: getVideos(state),
    selection: getSelections(state),
    detections: getDetections(state),
});

export default connect(mapStateToProps)(CanvasMenuItem);
