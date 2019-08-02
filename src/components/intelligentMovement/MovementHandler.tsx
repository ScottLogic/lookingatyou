import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    eyelidPosition,
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
    getAnimations,
    getDetections,
    getTargets,
} from '../../store/selectors/detectionSelectors';
import { getImageData } from '../../store/selectors/videoSelectors';
import { Animation } from '../../utils/pose/animations';
import { ICoords } from '../../utils/types';
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
    image: ImageData;
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
    private sleepTimeout: number;
    private tooBright: boolean;
    private isMovingLeft: boolean;
    private squinting: boolean;
    private personDetected: boolean;
    private openCoefficient: number;
    private textTimeout: number;

    constructor(props: MovementHandlerProps) {
        super(props);

        this.state = {
            dilationCoefficient: pupilSizes.neutral,
            showText: false,
            text: '',
        };

        this.movementInterval = 0;
        this.sleepTimeout = 0;
        this.tooBright = false;
        this.isMovingLeft = false;
        this.personDetected = false;
        this.squinting = false;
        this.openCoefficient = eyelidPosition.OPEN;
        this.textTimeout = 0;

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
            this.textTimeout = 0;
        }
    }

    animateEye() {
        this.checkSelection();
        this.calculateBrightness();
    }

    componentWillUnmount() {
        this.props.environment.clearInterval(this.movementInterval);
    }

    calculateBrightness() {
        if (this.props.image) {
            const { tooBright, scaledPupilSize } = analyseLight(
                this.props.image,
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
            this.openCoefficient = eyelidPosition.SQUINT;
            this.props.setIdleTarget({ x: 0, y: 0 });
        }
    }

    wake() {
        if (this.sleepTimeout !== 0) {
            this.props.environment.clearTimeout(this.sleepTimeout);
            this.sleepTimeout = 0;
            this.openCoefficient = eyelidPosition.OPEN;
        }

        if (this.textTimeout === 0) {
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
                    this.textTimeout = 0;
                }, userInteraction.textDuration);
            }, userInteraction.delay);
        }
    }

    sleep() {
        if (this.sleepTimeout === 0) {
            this.sleepTimeout = this.props.environment.setTimeout(() => {
                this.openCoefficient = eyelidPosition.CLOSED;
            }, intervals.sleep);
        }

        if (this.textTimeout !== 0) {
            this.props.environment.clearTimeout(this.textTimeout);
            this.textTimeout = 0;
        }
    }

    render() {
        return (
            <>
                <EyeController
                    dilation={this.state.dilationCoefficient}
                    detected={this.personDetected}
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
    image: getImageData(state),
    animation: getAnimations(state),
});

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
    setIdleTarget: (coords: ICoords) => dispatch(setIdleTarget(coords)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MovementHandler);
