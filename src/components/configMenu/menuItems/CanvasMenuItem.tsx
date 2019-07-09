import React from 'react';
import { connect } from 'react-redux';
import { IRootStore } from '../../../store/reducers/rootReducer';
import { getSelections } from '../../../store/selectors/detectionSelectors';
import { getVideos } from '../../../store/selectors/videoSelectors';
import { Bbox } from '../../../utils/types';
import { HelpWith } from '../Help';

interface ICanvasMenuItemProps {
    name: string;
    helpWith: HelpWith;
}

interface IAppMapStateToProps {
    videos: Array<HTMLVideoElement | undefined>;
    bbox: Bbox;
}

type CanvasMenuItemProps = ICanvasMenuItemProps & IAppMapStateToProps;

const mapStateToProps = (state: IRootStore) => {
    return {
        videos: getVideos(state),
        bbox: getSelections(state).left,
    };
};

export class CanvasMenuItem extends React.Component<CanvasMenuItemProps> {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    constructor(props: CanvasMenuItemProps) {
        super(props);

        this.state = {
            canvas: HTMLCanvasElement,
        };

        this.canvasRef = React.createRef();

        this.getStream = this.getStream.bind(this);
    }

    componentDidUpdate() {
        this.getStream();
    }

    getStream() {
        const video = this.props.videos[0] as HTMLVideoElement;
        if (this.props.bbox) {
            const [x, y, width, height] = this.props.bbox;
            const bbox = { x, y, width, height };
            this.drawImage(video, bbox);
        }
    }

    render() {
        return (
            <p data-tip={true} data-for={HelpWith[this.props.helpWith]}>
                <div>
                    <label>{this.props.name}</label>
                    <br />
                    <canvas id="canvas" ref={this.canvasRef} />
                </div>
            </p>
        );
    }

    drawImage(
        image: CanvasImageSource,
        bbox?: { x: number; y: number; width: number; height: number },
    ) {
        if (image instanceof HTMLVideoElement) {
            const canvas = this.canvasRef.current;
            if (canvas) {
                canvas.height = image.height;
                canvas.width = image.width;
                const canvasCtx = canvas.getContext('2d');

                if (canvasCtx) {
                    canvasCtx.drawImage(
                        image,
                        0,
                        0,
                        canvas.width,
                        canvas.height,
                    );
                    if (bbox !== undefined) {
                        canvasCtx.beginPath();
                        canvasCtx.lineWidth = 5;
                        canvasCtx.strokeStyle = 'red';
                        canvasCtx.rect(bbox.x, bbox.y, bbox.width, bbox.height);
                        canvasCtx.stroke();
                    }
                }
            }
        }
    }
}

export default connect(mapStateToProps)(CanvasMenuItem);
