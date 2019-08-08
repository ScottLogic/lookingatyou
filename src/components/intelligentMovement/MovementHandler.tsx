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
    getAnimationExists,
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
    selection?: IDetection;
    target: ICoords;
    image: ImageData;
    animation: Animation;
    animationExists: boolean;
}

interface IDispatchProps {
    updateAnimation: (animation: Animation) => ISetAnimationAction;
}

interface IMovementState {
    showText: boolean;
    text: string;
    isSleeping: boolean;
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
    private textTimeout: number;
    private dilationCoefficient: number;
    private openCoefficient: number;
    private hasMovedLeft: boolean;
    private personDetected: boolean;

    constructor(props: MovementHandlerProps) {
        super(props);

        this.state = {
            showText: false,
            text: '',
            isSleeping: false,
        };

        this.movementInterval = 0;
        this.sleepTimeout = 0;
        this.textTimeout = 0;
        this.dilationCoefficient = pupilSizes.neutral;
        this.openCoefficient = eyelidPosition.OPEN;
        this.hasMovedLeft = false;
        this.personDetected = false;

        this.animateEye = this.animateEye.bind(this);
        this.sleep = this.sleep.bind(this);
    }

    componentDidMount() {
        this.movementInterval = this.props.environment.setInterval(
            this.animateEye,
            1000 / this.props.fps,
        );
    }

    shouldComponentUpdate(
        nextProps: MovementHandlerProps,
        nextState: IMovementState,
    ) {
        return (
            this.state.isSleeping !== nextState.isSleeping ||
            (this.props.animationExists &&
                (this.props.height !== nextProps.height ||
                    this.props.width !== nextProps.width ||
                    this.props.target !== nextProps.target ||
                    this.props.selection !== nextProps.selection))
        );
    }

    componentWillReceiveProps(nextProps: MovementHandlerProps) {
        if (nextProps.animationExists && this.textTimeout) {
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
        const isSquinting = this.openCoefficient === eyelidPosition.SQUINT;
        if (isSquinting && Math.random() < 0.1) {
            this.openCoefficient = eyelidPosition.OPEN;
        }

        if (this.props.selection) {
            this.setNewTarget();
            this.startTextTimer();
        } else {
            this.setNoTarget();

            if (this.props.animationExists) {
                if (
                    !this.state.isSleeping &&
                    Math.random() < chanceOfIdleEyesMovement
                ) {
                    this.hasMovedLeft = !this.hasMovedLeft;
                    this.props.updateAnimation(
                        naturalMovement(this.hasMovedLeft),
                    );
                }
            }
        }
    }

    setNewTarget() {
        this.wake();
        this.props.environment.clearTimeout(this.sleepTimeout);
        if (!this.personDetected) {
            this.personDetected = true;
            this.dilationCoefficient = pupilSizes.dilated;
        }
    }

    setNoTarget() {
        if (this.personDetected) {
            this.personDetected = false;
            this.dilationCoefficient = eyelidPosition.SQUINT;
            this.openCoefficient = eyelidPosition.SQUINT;
            this.sleepTimeout = this.props.environment.setTimeout(
                this.sleep,
                intervals.sleep,
            );
        }
        this.props.environment.clearTimeout(this.textTimeout);
        this.textTimeout = 0;
    }

    sleep() {
        this.setState({ isSleeping: true });
    }

    wake() {
        this.setState({ isSleeping: false });
    }

    startTextTimer() {
        if (!this.textTimeout) {
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

    render() {
        return (
            <div className="movementHandler">
                <EyeController
                    dilation={this.dilationCoefficient}
                    detected={this.personDetected}
                    openCoefficient={this.openCoefficient}
                    isSleeping={this.state.isSleeping}
                    {...this.props}
                />
                <FadeInText text={this.state.text} show={this.state.showText} />
            </div>
        );
    }
}

const mapStateToProps = (state: IRootStore) => ({
    fps: getFPS(state),
    selection: getSelections(state),
    target: getTargets(state),
    image: getImageData(state),
    animation: getAnimations(state),
    animationExists: getAnimationExists(state),
});

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
    updateAnimation: (animation: Animation) =>
        dispatch(setAnimation(animation)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MovementHandler);
