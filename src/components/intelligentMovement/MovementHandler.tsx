import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    blinkConsts,
    eyelidPosition,
    EyeSide,
    intervals,
    pupilSizes,
    userInteraction,
} from '../../AppConstants';
import { IDetection } from '../../models/objectDetection';
import { setIdleTarget } from '../../store/actions/detections/actions';
import { ISetIdleTargetAction } from '../../store/actions/detections/types';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getFPS } from '../../store/selectors/configSelectors';
import {
    getDetections,
    getTargets,
} from '../../store/selectors/detectionSelectors';
import { Animation } from '../../utils/pose/animations';
import { ICoords } from '../../utils/types';
import { getLargerDistance } from '../../utils/utils';
import EyeController from '../eye/EyeController';
import { analyseLight, naturalMovement } from '../eye/utils/MovementUtils';
import FadeInText from '../fadeInText/FadeInText';

interface IMovementProps {
    width: number;
    height: number;
    environment: Window;
}

interface IStateProps {
    fps: number;
    detections: IDetection[];
    target: ICoords;
    images: { [key: string]: ImageData };
    animation: Animation;
}

interface IDispatchProps {
    setIdleTarget: (coords: ICoords) => ISetIdleTargetAction;
}

interface IMovementState {
    dilationCoefficient: number;
    showText: boolean;
    text: string;
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
    private detected: boolean;
    private prevProps: MovementHandlerProps | null;
    private openCoefficient: number;
    private textTimeout: number | null;

    constructor(props: MovementHandlerProps) {
        super(props);

        this.state = {
            dilationCoefficient: pupilSizes.neutral,
            showText: false,
            text: '',
        };

        this.movementInterval = 0;
        this.sleepTimeout = null;
        this.tooBright = false;
        this.isMovingLeft = false;
        this.detected = false;
        this.squinting = false;
        this.prevProps = null;
        this.openCoefficient = eyelidPosition.OPEN;
        this.textTimeout = null;

        this.animateEye = this.animateEye.bind(this);
        this.isNewTarget = this.isNewTarget.bind(this);
        this.hasTargetLeft = this.hasTargetLeft.bind(this);
        this.checkSelection = this.checkSelection.bind(this);
        this.calculateBrightness = this.calculateBrightness.bind(this);
        this.sleep = this.sleep.bind(this);
        this.wake = this.wake.bind(this);
    }

    componentDidMount() {
        this.movementInterval = this.props.environment.setInterval(
            this.animateEye,
            1000 / this.props.fps,
            this.prevProps,
        );
    }

    shouldComponentUpdate(nextProps: MovementHandlerProps) {
        return (
            this.props.animation.length === 0 &&
            (this.props.height !== nextProps.height ||
                this.props.width !== nextProps.width ||
                this.props.target !== nextProps.target ||
                this.props.detections !== nextProps.detections)
        );
    }

    componentWillReceiveProps(nextProps: MovementHandlerProps) {
        if (nextProps.animation.length > 0 && this.textTimeout) {
            this.props.environment.clearTimeout(this.textTimeout);
            this.textTimeout = null;
        }
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
        this.props.environment.clearInterval(this.movementInterval);
    }

    calculateBrightness() {
        if (this.props.images[EyeSide.LEFT]) {
            const { tooBright, scaledPupilSize } = analyseLight(
                this.props.images[EyeSide.LEFT],
                this.tooBright,
            );
            if (tooBright) {
                this.tooBright = true;
                this.openCoefficient = eyelidPosition.CLOSED;
            } else if (this.tooBright) {
                this.tooBright = false;
                this.openCoefficient = eyelidPosition.OPEN;
            }
            this.setState({ dilationCoefficient: scaledPupilSize });
        }
    }

    checkSelection() {
        if (this.squinting && Math.random() < 0.1) {
            this.squinting = false;
            this.openCoefficient = eyelidPosition.OPEN;
        }

        if (this.props.detections.length > 0) {
            this.wake();

            if (this.squinting) {
                this.openCoefficient = eyelidPosition.OPEN;
            }

            this.isNewTarget();
        } else {
            this.sleep();
            this.hasTargetLeft();

            let idleCoords = this.props.target;

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
                prevProps.target,
                this.props.target,
            );

            if (leftEyeDist > blinkConsts.movementThreshold) {
                this.openCoefficient = eyelidPosition.CLOSED;
            }
        }
    }

    isNewTarget() {
        if (!this.detected) {
            this.detected = true;
            this.setState({
                dilationCoefficient: pupilSizes.dilated,
            });
        }
    }

    hasTargetLeft() {
        if (this.detected) {
            this.detected = false;
            this.squinting = true;
            this.setState({
                dilationCoefficient: pupilSizes.constricted,
            });
            this.openCoefficient = eyelidPosition.SQUINT;
            this.props.setIdleTarget({ x: 0, y: 0 });
        }
    }

    wake() {
        if (this.sleepTimeout !== null) {
            clearTimeout(this.sleepTimeout);
            this.sleepTimeout = null;
            this.openCoefficient = eyelidPosition.OPEN;
        }

        if (this.textTimeout === null) {
            this.textTimeout = this.props.environment.setTimeout(() => {
                this.setState({
                    showText: true,
                    text:
                        userInteraction.texts[
                            Math.floor(
                                Math.random() * userInteraction.texts.length,
                            )
                        ],
                });
                this.props.environment.setTimeout(() => {
                    this.setState({ showText: false });
                    this.textTimeout = null;
                }, userInteraction.textDuration);
            }, userInteraction.delay);
        }
    }

    sleep() {
        if (this.sleepTimeout === null) {
            this.sleepTimeout = setTimeout(() => {
                this.openCoefficient = eyelidPosition.CLOSED;
            }, intervals.sleep);
        }

        if (this.textTimeout !== null) {
            this.props.environment.clearTimeout(this.textTimeout);
            this.textTimeout = null;
        }
    }

    render() {
        return (
            <>
                <EyeController
                    dilation={this.state.dilationCoefficient}
                    detected={this.detected}
                    openCoefficient={this.openCoefficient}
                    {...this.props}
                />
                <FadeInText text={this.state.text} show={this.state.showText} />
            </>
        );
    }
}

const mapStateToProps = (state: IRootStore) => ({
    fps: getFPS(state),
    detections: getDetections(state),
    target: getTargets(state),
    images: state.videoStore.images,
    animation: state.detectionStore.animation,
});

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
    setIdleTarget: (coords: ICoords) => dispatch(setIdleTarget(coords)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MovementHandler);
