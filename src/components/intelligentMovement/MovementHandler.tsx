import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    chanceOfIdleEyesMovement,
    eyelidPosition,
    intervals,
    lightConsts,
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
    getSelections,
    getTargets,
} from '../../store/selectors/detectionSelectors';
import { getImageData } from '../../store/selectors/videoSelectors';
import { normalise } from '../../utils/objectTracking/calculateFocus';
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
    selection: IDetection | undefined;
    target: ICoords;
    image: ImageData;
    animation: Animation;
}

interface IDispatchProps {
    updateAnimation: (animation: Animation) => ISetAnimationAction;
}

interface IMovementState {
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
    private hasMovedLeft: boolean;
    private personDetected: boolean;
    private dilationCoefficient: number;
    private openCoefficient: number;
    private textTimeout: number;

    constructor(props: MovementHandlerProps) {
        super(props);

        this.state = {
            showText: false,
            text: '',
        };

        this.dilationCoefficient = pupilSizes.neutral;
        this.openCoefficient = eyelidPosition.OPEN;
        this.movementInterval = 0;
        this.sleepTimeout = 0;
        this.hasMovedLeft = false;
        this.personDetected = false;
        this.textTimeout = 0;

        this.animateEye = this.animateEye.bind(this);
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
                this.props.selection !== nextProps.selection)
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
            const brightness = analyseLight(this.props.image);
            this.dilationCoefficient = normalise(
                lightConsts.maxBrightness - brightness,
                lightConsts.maxBrightness,
                0,
                lightConsts.dilationMultipler + lightConsts.dilationOffset,
                lightConsts.dilationOffset,
            );
            this.openCoefficient =
                brightness >= lightConsts.maxBrightness
                    ? eyelidPosition.CLOSED
                    : eyelidPosition.OPEN;
        }
    }

    checkSelection() {
        if (
            this.openCoefficient === eyelidPosition.SQUINT &&
            Math.random() < 0.1
        ) {
            this.openCoefficient = eyelidPosition.OPEN;
        }

        if (this.props.selection) {
            this.props.environment.clearTimeout(this.sleepTimeout);
            this.openCoefficient = eyelidPosition.OPEN;
            this.isNewTarget();
        } else {
            this.sleepTimeout = this.props.environment.setTimeout(() => {
                this.openCoefficient = eyelidPosition.CLOSED;
            }, intervals.sleep);
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
            this.dilationCoefficient = pupilSizes.dilated;
        }
    }

    hasTargetLeft() {
        if (this.personDetected) {
            this.personDetected = false;
            this.dilationCoefficient = eyelidPosition.SQUINT;
            this.openCoefficient = eyelidPosition.SQUINT;
        }
    }

    wake() {
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
        if (this.textTimeout !== 0) {
            this.props.environment.clearTimeout(this.textTimeout);
            this.textTimeout = 0;
        }
    }

    render() {
        return (
            <>
                <EyeController
                    dilation={this.dilationCoefficient}
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
    selection: getSelections(state),
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
