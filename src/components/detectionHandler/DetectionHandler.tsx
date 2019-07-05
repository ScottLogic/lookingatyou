import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    DetectionConfig,
    IDetections,
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
import matchYPosition from '../../utils/objectSelection/rightEyeObjectMatching/matchYPosition';
import selectFirst from '../../utils/objectSelection/selectFirst';
import calculateTargetPos, {
    normalise,
} from '../../utils/objectTracking/calculateFocus';
import { DetectionImage, ITargets } from '../../utils/types';

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
    setTarget: (target: ITargets) => ISetTargetAction;
    setDetections: (detections: IDetections) => ISetDetectionsAction;
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
            this.props.videos,
        );
    }

    componentWillUnmount() {
        clearInterval(this.detectionInterval);
    }

    render() {
        return null;
    }

    async detectionHandler(images: DetectionImage[]) {
        if (images.length === 0) {
            return;
        }
        if (this.model) {
            const leftEyeDetections = await this.model.detect(images[0]);
            const leftEyeSelection = selectFirst(leftEyeDetections);
            if (leftEyeSelection) {
                const leftEyeCoords = calculateTargetPos(leftEyeSelection);
                let rightEyeDetections = null;
                const leftTarget = {
                    x: normalise(leftEyeCoords.x, images[0]!.width),
                    y: normalise(leftEyeCoords.y, images[0]!.height),
                };
                let rightTarget = null;
                if (images.length >= 2) {
                    rightEyeDetections = await this.model.detect(images[1]);
                    const rightEyeSelection = matchYPosition(
                        leftEyeSelection,
                        rightEyeDetections,
                    );
                    if (rightEyeSelection) {
                        const rightEyeCoords = calculateTargetPos(
                            rightEyeSelection,
                        );
                        rightTarget = {
                            x: normalise(rightEyeCoords.x, images[1]!.width),
                            y: normalise(rightEyeCoords.y, images[1]!.height),
                        };
                        const averageY = rightTarget.y + leftTarget.y;
                        rightTarget.y = averageY;
                        leftTarget.y = averageY;
                    }
                }
                this.props.setTarget({
                    left: leftTarget,
                    right: rightTarget,
                });
                this.props.setDetections({
                    left: leftEyeDetections,
                    right: rightEyeDetections,
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
        setTarget: (target: ITargets) => dispatch(setTarget(target)),
        setDetections: (detections: IDetections) =>
            dispatch(setDetections(detections)),
    };
};

export default connect(
    mergeStateToProps,
    mergeDispatchToProps,
)(DetectionHandler);
