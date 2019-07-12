import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { eyelidPosition, pupilSizes, sleepDelay } from '../../AppConstants';
import { IDetections } from '../../models/objectDetection';
import { setOpen, setTarget } from '../../store/actions/detections/actions';
import {
    ISetOpenAction,
    ISetTargetAction,
} from '../../store/actions/detections/types';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getVideos } from '../../store/selectors/videoSelectors';
import { ITargets } from '../../utils/types';
import EyeController from '../eye/EyeController';
import { analyseLight, checkLight, naturalMovement } from '../eye/EyeUtils';

interface IMovementProps {
    document: Document;
    width: number;
    height: number;
    environment: Window;
}

interface IStateProps {
    fps: number;
    detections: IDetections;
    target: ITargets;
    videos: Array<HTMLVideoElement | undefined>;
    openCoefficient: number;
}

interface IDispatchProps {
    setTarget: (target: ITargets) => ISetTargetAction;
    setOpen: (openCoefficient: number) => ISetOpenAction;
}

interface IMovementState {
    dilationCoefficient: number;
}

export type MovementHandlerProps = IMovementProps &
    IDispatchProps &
    IStateProps;

export class MovementHandler extends React.Component<
    MovementHandlerProps,
    IMovementState
> {
    private movementInterval: number;
    private sleepTimeout: NodeJS.Timeout | null;
    private tooBright: boolean;
    private left: boolean;
    private squinting: boolean;
    private personDetected: boolean;

    constructor(props: MovementHandlerProps) {
        super(props);

        this.state = {
            dilationCoefficient: pupilSizes.neutral,
        };

        this.movementInterval = 0;
        this.sleepTimeout = null;
        this.tooBright = false;
        this.left = false;
        this.personDetected = false;
        this.squinting = false;

        this.animateEye = this.animateEye.bind(this);
        this.isNewTarget = this.isNewTarget.bind(this);
        this.hasTargetLeft = this.hasTargetLeft.bind(this);
        this.checkSelection = this.checkSelection.bind(this);
        this.calculateBrightness = this.calculateBrightness.bind(this);
        this.sleep = this.sleep.bind(this);
        this.wake = this.wake.bind(this);
    }

    componentDidMount() {
        this.movementInterval = window.setInterval(
            this.animateEye,
            1000 / this.props.fps,
        );
    }

    shouldComponentUpdate(nextProps: MovementHandlerProps) {
        return (
            this.props.fps !== nextProps.fps ||
            this.props.height !== nextProps.height ||
            this.props.width !== nextProps.width ||
            this.props.openCoefficient !== nextProps.openCoefficient ||
            this.props.target !== nextProps.target
        );
    }

    componentDidUpdate() {
        clearInterval(this.movementInterval);
        this.movementInterval = window.setInterval(
            this.animateEye,
            1000 / this.props.fps,
        );
    }

    animateEye() {
        this.checkSelection();
        this.calculateBrightness();
    }

    componentWillUnmount() {
        clearInterval(this.movementInterval);
    }

    calculateBrightness() {
        if (this.props.videos[0]) {
            const { tooBright, scaledPupilSize } = checkLight(
                window.document,
                this.tooBright,
                this.props.videos[0] as HTMLVideoElement,
                analyseLight,
            );

            if (tooBright) {
                this.tooBright = true;
                this.props.setOpen(eyelidPosition.CLOSED);
            } else if (this.tooBright) {
                this.tooBright = false;
                this.props.setOpen(eyelidPosition.OPEN);
            }
            this.setState({ dilationCoefficient: scaledPupilSize });
        }
    }

    checkSelection() {
        let target = this.props.target;

        const selection = this.props.detections.left.find(detection => {
            return detection.info.type === 'person';
        });

        if (this.squinting && Math.random() < 0.1) {
            this.squinting = false;
            this.props.setOpen(eyelidPosition.OPEN);
        }

        if (
            this.props.openCoefficient === eyelidPosition.CLOSED &&
            Math.random() < 0.5
        ) {
            this.props.setOpen(eyelidPosition.OPEN);
        }

        if (selection) {
            this.wake();

            if (this.squinting) {
                this.props.setOpen(eyelidPosition.OPEN);
            }

            this.isNewTarget();
        } else {
            this.sleep();
            this.hasTargetLeft();

            if (Math.abs(this.props.target.left.x) > 1) {
                target = {
                    left: {
                        x: 0,
                        y: this.props.target.left.y,
                    },
                    right: null,
                };
            }

            const { newX, left } = naturalMovement(
                this.props.target.left.x,
                this.left,
            );

            target = { left: { x: newX, y: 0 }, right: null };
            this.props.setTarget(target);

            this.left = left;
        }
    }

    isNewTarget() {
        if (!this.personDetected) {
            this.personDetected = true;
            this.setState({
                dilationCoefficient: pupilSizes.dilated,
            });
        }
    }

    hasTargetLeft() {
        if (this.personDetected) {
            this.personDetected = false;
            this.squinting = true;
            this.setState({
                dilationCoefficient: pupilSizes.constricted,
            });
            this.props.setOpen(eyelidPosition.SQUINT);
            this.props.setTarget({ left: { x: 0, y: 0 }, right: null });
        }
    }

    wake() {
        if (this.sleepTimeout !== null) {
            clearTimeout(this.sleepTimeout);
            this.sleepTimeout = null;
            this.props.setOpen(eyelidPosition.OPEN);
        }
    }

    sleep() {
        if (this.sleepTimeout === null) {
            this.sleepTimeout = setTimeout(() => {
                this.props.setOpen(eyelidPosition.CLOSED);
            }, sleepDelay);
        }
    }

    render() {
        return (
            <EyeController
                width={this.props.width}
                height={this.props.height}
                environment={this.props.environment}
                dilation={this.state.dilationCoefficient}
                detected={this.personDetected}
            />
        );
    }
}

const mergeStateToProps = (state: IRootStore) => {
    return {
        fps: state.configStore.config.fps,
        detections: state.detectionStore.detections,
        target: state.detectionStore.target,
        openCoefficient: state.detectionStore.openCoefficient,
        videos: getVideos(state),
    };
};

const mergeDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
    return {
        setTarget: (target: ITargets) => dispatch(setTarget(target)),
        setOpen: (openCoefficient: number) =>
            dispatch(setOpen(openCoefficient)),
    };
};

export default connect(
    mergeStateToProps,
    mergeDispatchToProps,
)(MovementHandler);
