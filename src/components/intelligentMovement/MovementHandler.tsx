import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    chanceOfIdleEyesMovement,
    eyelidPosition,
    intervals,
    pupilSizes,
    userInteraction,
} from '../../AppConstants';
import { IDetection } from '../../models/objectDetection';
import { setAnimation } from '../../store/actions/detections/actions';
import { ISetAnimationAction } from '../../store/actions/detections/types';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getFPS } from '../../store/selectors/configSelectors';
import {
    getAnimations,
    getDetections,
    getTargets,
} from '../../store/selectors/detectionSelectors';
import { getImageData } from '../../store/selectors/videoSelectors';
import { Animation, naturalMovement } from '../../utils/pose/animations';
import { ICoords } from '../../utils/types';
import EyeController from '../eye/EyeController';
import { analyseLight } from '../eye/utils/MovementUtils';
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
    updateAnimation: (animation: Animation) => ISetAnimationAction;
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
    private hasMovedLeft: boolean;
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
        this.hasMovedLeft = false;
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
            if (this.props.animation.length === 0) {
                if (Math.random() < chanceOfIdleEyesMovement) {
                    this.hasMovedLeft = !this.hasMovedLeft;
                    this.props.updateAnimation(
                        naturalMovement(this.hasMovedLeft),
                    );
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
            this.openCoefficient = eyelidPosition.SQUINT;
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
                const totalFrequency = userInteraction.texts
                    .map(text => text.frequency)
                    .reduce((x, y) => x + y);
                let random = Math.random() * totalFrequency;
                let i = 0;
                while (random >= 0 && i < userInteraction.texts.length - 1) {
                    random -= userInteraction.texts[i].frequency;
                    i++;
                }
                const phrase = userInteraction.texts[i - 1].phrase;
                this.setState({
                    showText: true,
                    text: phrase,
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
    updateAnimation: (animation: Animation) =>
        dispatch(setAnimation(animation)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MovementHandler);
