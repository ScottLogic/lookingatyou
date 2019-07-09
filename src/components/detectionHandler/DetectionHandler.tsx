import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    DetectionConfig,
    IDetections,
    IObjectDetector,
    ISelections,
    ModelConfig,
} from '../../models/objectDetection';
import {
    setDetections,
    setModelLoaded,
    setSelections,
    setTarget,
} from '../../store/actions/detections/actions';
import {
    ISetDetectionsAction,
    ISetLoadedAction,
    ISetSelectionsAction,
    ISetTargetAction,
} from '../../store/actions/detections/types';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getVideos } from '../../store/selectors/videoSelectors';
import { AppStore } from '../../store/store';
import CocoSSD from '../../utils/objectDetection/cocoSSD';
import matchYPosition from '../../utils/objectSelection/rightEyeObjectMatching/matchYPosition';
import select, { closerTo } from '../../utils/objectSelection/select';
import calculateTargetPos, {
    normalise,
} from '../../utils/objectTracking/calculateFocus';
import { DetectionImage, ITargets } from '../../utils/types';
import {
    calculateBrightness,
    checkSelection,
} from '../intelligentMovement/MovementHandler';

interface IDetectionHandlerProps {
    modelConfig: ModelConfig;
    detectionConfig: DetectionConfig;
    store: AppStore;
}

interface IStateProps {
    FPS: number;
    videos: Array<HTMLVideoElement | undefined>;
    target: ITargets;
}

interface IDispatchProps {
    setModelLoaded: (hasLoaded: boolean) => ISetLoadedAction;
    setTarget: (target: ITargets) => ISetTargetAction;
    setDetections: (detections: IDetections) => ISetDetectionsAction;
    setSelections: (selections: ISelections) => ISetSelectionsAction;
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
            const leftEyeSelection = select(
                leftEyeDetections,
                closerTo(this.props.target.left),
            );
            if (leftEyeSelection) {
                const leftEyeCoords = calculateTargetPos(leftEyeSelection);
                let rightEyeDetections = null;
                let rightEyeSelection = null;
                const leftTarget = {
                    x: normalise(leftEyeCoords.x, images[0]!.width),
                    y: normalise(leftEyeCoords.y, images[0]!.height),
                };
                let rightTarget = null;
                if (images.length >= 2) {
                    rightEyeDetections = await this.model.detect(images[1]);
                    rightEyeSelection = matchYPosition(
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
                this.props.setSelections({
                    left: leftEyeSelection,
                    right:
                        rightEyeSelection === undefined
                            ? null
                            : rightEyeSelection,
                });
            } else {
                this.props.setDetections({ left: [], right: [] });
            }
        }
        checkSelection(this.props.store);
        calculateBrightness(this.props.store);
    }
}

const mergeStateToProps = (state: IRootStore) => {
    return {
        videos: getVideos(state),
        FPS: state.configStore.config.fps,
        target: state.detectionStore.target,
    };
};

const mergeDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
    return {
        setModelLoaded: (hasLoaded: boolean) =>
            dispatch(setModelLoaded(hasLoaded)),
        setTarget: (target: ITargets) => dispatch(setTarget(target)),
        setDetections: (detections: IDetections) =>
            dispatch(setDetections(detections)),
        setSelections: (selections: ISelections) =>
            dispatch(setSelections(selections)),
    };
};

export default connect(
    mergeStateToProps,
    mergeDispatchToProps,
)(DetectionHandler);
