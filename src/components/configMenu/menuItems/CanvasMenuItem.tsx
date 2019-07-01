import React from 'react';
import { connect } from 'react-redux';
import { IRootStore } from '../../../store/reducers/rootReducer';
import {
    getDeviceIds,
    getVideos,
} from '../../../store/selectors/videoSelectors';
import Video from '../../video/Video';
interface ICanvasMenuItemProps {
    name: string;
    bbox: number[];
}

interface IAppMapStateToProps {
    deviceIds: string[];
    videos: Array<HTMLVideoElement | undefined>;
}

type CanvasMenuItemProps = ICanvasMenuItemProps & IAppMapStateToProps;

const mapStateToProps = (state: IRootStore) => {
    return {
        deviceIds: getDeviceIds(state),
        videos: getVideos(state),
    };
};

export class CanvasMenuItem extends React.Component<CanvasMenuItemProps> {
    private canvasRef: React.RefObject<HTMLCanvasElement>;

    constructor(props: CanvasMenuItemProps) {
        super(props);
        this.canvasRef = React.createRef<HTMLCanvasElement>();

        this.state = {
            canvas: HTMLCanvasElement,
        };

        this.getStream = this.getStream.bind(this);
    }

    componentDidMount() {
        const video = this.props.videos[0] as HTMLVideoElement;
        // this.canvasRef = video;
    }

    componentDidUpdate() {
        this.getStream();
    }

    getStream() {
        /*if (this.props.videos[0] instanceof HTMLVideoElement) {
            const img = new Image();

            const canvas = document.createElement('canvas');
            const canvasContext = canvas.getContext('2d');

            const video = this.props.videos[0] as HTMLVideoElement;

            if (canvasContext) {
                canvasContext.drawImage(video, 0, 0, video.height, video.width);

                img.src = canvas.toDataURL();

                setStream.call(this, img);
            }
        }*/
        const video = this.props.videos[0] as HTMLVideoElement;
        const [x, y, width, height] = this.props.bbox;
        const bbox = { x, y, width, height };
        this.drawImage(video, bbox);
    }

    render() {
        return (
            <div>
                <label>{this.props.name}</label>
                <br />
                <div className="webcam-feed">
                    {this.props.deviceIds.map((device, key) => (
                        <Video key={key} deviceId={device} />
                    ))}
                </div>
                <canvas id="canvas" width="320" height="240" />
            </div>
        );
    }

    drawImage(
        image: CanvasImageSource,
        bbox?: { x: number; y: number; width: number; height: number },
    ) {
        if (image instanceof HTMLVideoElement) {
            const canvas = document.getElementById(
                'canvas',
            ) as HTMLCanvasElement;
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
