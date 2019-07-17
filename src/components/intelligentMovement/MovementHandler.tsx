import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    eyelidPosition,
    maxMoveWithoutBlink,
    pupilSizes,
    sleepDelay,
} from '../../AppConstants';
import { Detection } from '../../models/objectDetection';
import { setIdleTarget, setOpen } from '../../store/actions/detections/actions';
import {
    ISetIdleTargetAction,
    ISetOpenAction,
} from '../../store/actions/detections/types';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getTargets } from '../../store/selectors/detectionSelectors';
import { getVideos } from '../../store/selectors/videoSelectors';
import { ICoords, ITargets } from '../../utils/types';
import { getLargerDistance } from '../../utils/utils';
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
    detections: Detection[];
    target: ITargets;
    videos: Array<HTMLVideoElement | undefined>;
    openCoefficient: number;
}

interface IDispatchProps {
    setIdleTarget: (coords: ICoords) => ISetIdleTargetAction;
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
    private isMovingLeft: boolean;
    private squinting: boolean;
    private personDetected: boolean;
    private prevProps: MovementHandlerProps | null;

    constructor(props: MovementHandlerProps) {
        super(props);

        this.state = {
            dilationCoefficient: pupilSizes.neutral,
        };

        this.movementInterval = 0;
        this.sleepTimeout = null;
        this.tooBright = false;
        this.isMovingLeft = false;
        this.personDetected = false;
        this.squinting = false;
        this.prevProps = null;

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
            this.prevProps,
        );
    }

    shouldComponentUpdate(nextProps: MovementHandlerProps) {
        return (
            this.props.height !== nextProps.height ||
            this.props.width !== nextProps.width ||
            this.props.openCoefficient !== nextProps.openCoefficient ||
            this.props.target !== nextProps.target ||
            this.props.detections !== nextProps.detections
        );
    }

    componentDidUpdate(prevProps: MovementHandlerProps) {
        this.prevProps = prevProps;
    }

    animateEye(prevProps: MovementHandlerProps) {
        this.checkSelection();
        this.calculateBrightness();
        this.checkBlink(prevProps);
    }

    componentWillUnmount() {
        clearInterval(this.movementInterval);
    }

    calculateBrightness() {
        if (this.props.videos[0]) {
            const { tooBright, scaledPupilSize } = checkLight(
                this.props.environment.document,
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

        if (this.props.detections.length > 0) {
            this.wake();

            if (this.squinting) {
                this.props.setOpen(eyelidPosition.OPEN);
            }

            this.isNewTarget();
        } else {
            this.sleep();
            this.hasTargetLeft();

            let idleCoords = this.props.target.left;

            if (Math.abs(idleCoords.x) > 1) {
                idleCoords.x = 0;
            }

            const { newX, isMovingLeft } = naturalMovement(
                idleCoords.x,
                this.isMovingLeft,
            );

            idleCoords = { x: newX, y: 0 };
            this.props.setIdleTarget(idleCoords);

            this.isMovingLeft = isMovingLeft;
        }
    }

    checkBlink(prevProps?: MovementHandlerProps) {
        if (prevProps && this.props.target) {
            const leftEyeDist = getLargerDistance(
                prevProps.target.left,
                this.props.target.left,
            );

            if (leftEyeDist > maxMoveWithoutBlink) {
                this.props.setOpen(eyelidPosition.CLOSED);
            }

            if (prevProps.target.right && this.props.target.right) {
                const rightEyeDist = getLargerDistance(
                    prevProps.target.right,
                    this.props.target.right,
                );

                if (rightEyeDist > maxMoveWithoutBlink) {
                    this.props.setOpen(eyelidPosition.CLOSED);
                }
            }
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
            this.props.setIdleTarget({ x: 0, y: 0 });
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

const mapStateToProps = (state: IRootStore) => {
    return {
        fps: state.configStore.config.fps,
        detections: state.detectionStore.detections.left,
        target: getTargets(state),
        openCoefficient: state.detectionStore.eyesOpenCoefficient,
        videos: getVideos(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
    return {
        setIdleTarget: (coords: ICoords) => dispatch(setIdleTarget(coords)),
        setOpen: (openCoefficient: number) =>
            dispatch(setOpen(openCoefficient)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MovementHandler);
