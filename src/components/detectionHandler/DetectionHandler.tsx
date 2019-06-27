import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    DetectionConfig,
    IDetection,
    IObjectDetector,
    ModelConfig,
} from '../../models/objectDetection';
import {
    setDetections,
    setModelLoaded,
    setTarget,
} from '../../store/actions/detections/actions';
import {
    ISetDetectionsAction,
    ISetLoadedAction,
    ISetTargetAction,
} from '../../store/actions/detections/types';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getVideos } from '../../store/selectors/videoSelectors';
import CocoSSD from '../../utils/objectDetection/cocoSSD';
import selectFirst from '../../utils/objectSelection/selectFirst';
import calculateTargetPos, {
    normalise,
} from '../../utils/objectTracking/calculateFocus';
import { DetectionImage, ICoords } from '../../utils/types';

interface IDetectionHandlerProps {
    modelConfig: ModelConfig;
    detectionConfig: DetectionConfig;
}

interface IStateProps {
    FPS: number;
    videos: Array<HTMLVideoElement | undefined>;
}

interface IDispatchProps {
    setModelLoaded: (hasLoaded: boolean) => ISetLoadedAction;
    setTarget: (target: ICoords) => ISetTargetAction;
    setDetections: (detections: IDetection[]) => ISetDetectionsAction;
}

export type DetectionHandlerProps = IDetectionHandlerProps &
    IStateProps &
    IDispatchProps;

export class DetectionHandler extends React.Component<DetectionHandlerProps> {
    private model: IObjectDetector | null;
    private detectionInterval: number;
    constructor(props: DetectionHandlerProps) {
        super(props);
        this.model = null;
        this.detectionInterval = 0;

        this.detectionHandler = this.detectionHandler.bind(this);
    }

    async componentDidMount() {
        this.model = await CocoSSD.init(this.props.modelConfig);
        this.props.setModelLoaded(true);
        this.detectionInterval = setInterval(
            this.detectionHandler,
            1000 / this.props.FPS,
            this.props.videos[0],
        );
    }

    shouldComponentUpdate(nextProps: DetectionHandlerProps) {
        return (
            this.props.FPS !== nextProps.FPS ||
            this.props.videos !== nextProps.videos
        );
    }

    componentDidUpdate(previousProps: DetectionHandlerProps) {
        clearInterval(this.detectionInterval);
        this.detectionInterval = setInterval(
            this.detectionHandler,
            1000 / this.props.FPS,
            this.props.videos[0],
        );
    }

    componentWillUnmount() {
        clearInterval(this.detectionInterval);
    }

    render() {
        return null;
    }

    async detectionHandler(image: DetectionImage) {
        if (this.model) {
            const detections = await this.model.detect(image);
            this.props.setDetections(detections);
            const selection = selectFirst(detections);
            const coords = calculateTargetPos(selection);
            if (coords) {
                this.props.setTarget({
                    x: normalise(coords.x, image!.width),
                    y: normalise(coords.y, image!.height),
                });
            }
        }
    }
}

const mergeStateToProps = (state: IRootStore) => {
    return { videos: getVideos(state), FPS: state.configStore.config.fps };
};

const mergeDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
    return {
        setModelLoaded: (hasLoaded: boolean) =>
            dispatch(setModelLoaded(hasLoaded)),
        setTarget: (target: ICoords) => dispatch(setTarget(target)),
        setDetections: (detections: IDetection[]) =>
            dispatch(setDetections(detections)),
    };
};

export default connect(
    mergeStateToProps,
    mergeDispatchToProps,
)(DetectionHandler);
