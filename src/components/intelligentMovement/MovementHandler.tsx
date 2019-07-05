import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { eyelidPosition, pupilSizes, sleepDelay } from '../../AppConstants';
import { IDetections } from '../../models/objectDetection';
import {
    setBright,
    setDetected,
    setDilation,
    setLeft,
    setOpen,
    setSquinting,
    setTarget,
} from '../../store/actions/detections/actions';
import {
    ISetBrightAction,
    ISetDilationAction,
    ISetLeftAction,
    ISetOpenAction,
    ISetPersonAction,
    ISetSquintAction,
    ISetTargetAction,
} from '../../store/actions/detections/types';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getVideos } from '../../store/selectors/videoSelectors';
import { ITargets } from '../../utils/types';
import { analyseLight, checkLight, naturalMovement } from '../eye/EyeUtils';

interface IMovementProps {
    document: Document;
}

interface IStateProps {
    fps: number;
    detections: IDetections;
    target: ITargets;
    tooBright: boolean;
    left: boolean;
    personDetected: boolean;
    squinting: boolean;
    openCoefficient: number;
    dilationCoefficient: number;
    videos: Array<HTMLVideoElement | undefined>;
}

interface IDispatchProps {
    setLeft: (left: boolean) => ISetLeftAction;
    setBright: (tooBright: boolean) => ISetBrightAction;
    setSquinting: (isSquinting: boolean) => ISetSquintAction;
    setOpen: (openCoefficient: number) => ISetOpenAction;
    setDilation: (dilation: number) => ISetDilationAction;
    setDetected: (detected: boolean) => ISetPersonAction;
    setTarget: (target: ITargets) => ISetTargetAction;
}

export type MovementHandlerProps = IMovementProps &
    IDispatchProps &
    IStateProps;

export class MovementHandler extends React.Component<MovementHandlerProps> {
    private movementInterval: number;
    private sleepTimeout: number | null;

    constructor(props: MovementHandlerProps) {
        super(props);

        this.movementInterval = 0;
        this.sleepTimeout = 0;

        this.calculateBrightness = this.calculateBrightness.bind(this);
        this.isNewTarget = this.isNewTarget.bind(this);
        this.hasTargetLeft = this.hasTargetLeft.bind(this);
        this.checkSelection = this.checkSelection.bind(this);
        this.movementHandler = this.movementHandler.bind(this);
        this.sleep = this.sleep.bind(this);
        this.wake = this.wake.bind(this);
    }

    componentDidMount() {
        this.movementInterval = window.setInterval(
            this.movementHandler,
            1000 / (2 * this.props.fps),
        );
    }

    componentShouldUpdate(nextProps: MovementHandlerProps) {
        return this.props.fps !== nextProps.fps;
    }

    componentDidUpdate() {
        clearInterval(this.movementInterval);
        this.movementInterval = window.setInterval(
            this.movementHandler,
            1000 / (2 * this.props.fps),
        );
    }

    componentWillUnmount() {
        clearInterval(this.movementInterval);
    }

    movementHandler() {
        this.checkSelection();
        this.calculateBrightness();
    }

    checkSelection() {
        const selection = this.props.detections.left.find(detection => {
            return detection.info.type === 'person';
        });

        if (this.props.squinting && Math.random() < 0.1) {
            this.props.setOpen(eyelidPosition.OPEN);
            this.props.setSquinting(false);
        }

        if (selection) {
            this.wake();
            if (this.props.squinting) {
                this.props.setOpen(eyelidPosition.OPEN);
            }
            this.isNewTarget();
        } else {
            this.hasTargetLeft();

            if (Math.abs(this.props.target.left.x) > 1) {
                this.props.setTarget({
                    left: {
                        x: 0,
                        y: this.props.target.left.y,
                    },
                    right: null,
                });
            }

            const { newX, left } = naturalMovement(
                this.props.target.left.x,
                this.props.left,
            );

            this.props.setTarget({ left: { x: newX, y: 0 }, right: null });
            this.props.setLeft(left);
        }
    }

    calculateBrightness() {
        if (this.props.videos[0]) {
            const { tooBright, scaledPupilSize } = checkLight(
                this.props.document,
                this.props.tooBright,
                this.props.videos[0] as HTMLVideoElement,
                analyseLight,
            );

            if (tooBright) {
                this.props.setBright(true);
                this.props.setOpen(eyelidPosition.CLOSED);
            } else if (this.props.tooBright) {
                this.props.setBright(false);
                this.props.setOpen(eyelidPosition.OPEN);
            }

            this.props.setDilation(scaledPupilSize);
        }
    }

    isNewTarget() {
        if (!this.props.personDetected) {
            this.props.setDetected(true);
            this.props.setDilation(pupilSizes.dilated);
            this.props.setDilation(pupilSizes.neutral);
        }
    }

    hasTargetLeft() {
        if (this.props.personDetected) {
            this.props.setDetected(false);
            this.props.setSquinting(true);
            this.props.setDilation(pupilSizes.constricted);
            this.props.setDilation(pupilSizes.neutral);
            this.props.setTarget({ left: { x: 0, y: 0 }, right: null });
            this.props.setOpen(eyelidPosition.SQUINT);
            this.sleep();
        }
    }

    wake() {
        if (this.sleepTimeout) {
            clearTimeout(this.sleepTimeout);
            this.sleepTimeout = null;
            this.props.setOpen(eyelidPosition.OPEN);
        }
    }

    sleep() {
        setTimeout(() => {
            this.props.setOpen(eyelidPosition.CLOSED);
        }, sleepDelay);
    }

    render() {
        return null;
    }
}

const mergeStateToProps = (state: IRootStore) => {
    return {
        fps: state.configStore.config.fps,
        detections: state.detectionStore.detections,
        target: state.detectionStore.target,
        tooBright: state.detectionStore.tooBright,
        left: state.detectionStore.left,
        squinting: state.detectionStore.isSquinting,
        openCoefficient: state.detectionStore.eyesOpenCoefficient,
        dilationCoefficient: state.detectionStore.dilationCoefficient,
        personDetected: state.detectionStore.personDetected,
        videos: getVideos(state),
    };
};

const mergeDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
    return {
        setLeft: (left: boolean) => dispatch(setLeft(left)),
        setSquinting: (isSquinting: boolean) =>
            dispatch(setSquinting(isSquinting)),
        setBright: (bright: boolean) => dispatch(setBright(bright)),
        setDilation: (dilation: number) => dispatch(setDilation(dilation)),
        setOpen: (openCoefficient: number) =>
            dispatch(setOpen(openCoefficient)),
        setDetected: (detected: boolean) => dispatch(setDetected(detected)),
        setTarget: (target: ITargets) => dispatch(setTarget(target)),
    };
};

export default connect(
    mergeStateToProps,
    mergeDispatchToProps,
)(MovementHandler);
