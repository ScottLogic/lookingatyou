import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { eyelidPosition, maxMoveWithoutBlink } from '../../AppConstants';
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
    setOpen,
    setSelections,
    setTarget,
} from '../../store/actions/detections/actions';
import {
    ISetDetectionsAction,
    ISetLoadedAction,
    ISetOpenAction,
    ISetSelectionsAction,
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
import { DetectionImage, ICoords, ITargets } from '../../utils/types';

interface IDetectionHandlerProps {
    modelConfig: ModelConfig;
    detectionConfig: DetectionConfig;
}

interface IStateProps {
    FPS: number;
    videos: Array<HTMLVideoElement | undefined>;
    targets: ITargets;
}

interface IDispatchProps {
    setModelLoaded: (hasLoaded: boolean) => ISetLoadedAction;
    setTarget: (target: ITargets) => ISetTargetAction;
    setDetections: (detections: IDetections) => ISetDetectionsAction;
    setSelections: (selections: ISelections) => ISetSelectionsAction;
    setOpenCoefficient: (openCoefficient: number) => ISetOpenAction;
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
        this.blinkOnLargeMove = this.blinkOnLargeMove.bind(this);
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
                const newTargets = { left: leftTarget, right: rightTarget };
                this.blinkOnLargeMove(newTargets);
                this.props.setTarget(newTargets);
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
    }

    blinkOnLargeMove(newTargets: ITargets) {
        const leftEyeDist = getLargerDistance(
            this.props.targets.left,
            newTargets.left,
        );

        if (leftEyeDist > maxMoveWithoutBlink) {
            this.props.setOpenCoefficient(eyelidPosition.CLOSED);
        }

        if (this.props.targets.right && newTargets.right) {
            const rightEyeDist = getLargerDistance(
                this.props.targets.right,
                newTargets.right,
            );

            if (rightEyeDist > maxMoveWithoutBlink) {
                this.props.setOpenCoefficient(eyelidPosition.CLOSED);
            }
        }
    }
}

function getLargerDistance(old: ICoords, newCoords: ICoords): number {
    return Math.max(
        Math.abs(old.x - newCoords.x),
        Math.abs(old.y - newCoords.y),
    );
}

const mergeStateToProps = (state: IRootStore) => {
    return {
        videos: state.videoStore.videos,
        FPS: state.configStore.config.fps,
        targets: state.detectionStore.target,
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
        setOpenCoefficient: (openCoefficient: number) =>
            dispatch(setOpen(openCoefficient)),
    };
};

export default connect(
    mergeStateToProps,
    mergeDispatchToProps,
)(DetectionHandler);
