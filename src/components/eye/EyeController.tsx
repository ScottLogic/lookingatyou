import React, { MutableRefObject, useEffect, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    blinkConsts,
    eyeCoefficients,
    eyelidPosition,
    eyeSensitivityScale,
    EyeSide,
    minIrisScale,
    numInnerEyeSectors,
    transitionTimes,
} from '../../AppConstants';
import { IDetection } from '../../models/objectDetection';
import { IAdvancedConfig, IAppConfig } from '../../store/actions/config/types';
import { setAnimation } from '../../store/actions/detections/actions';
import { ISetAnimationAction } from '../../store/actions/detections/types';
import { IRootStore } from '../../store/reducers/rootReducer';
import {
    getAdvancedConfig,
    getAppConfig,
} from '../../store/selectors/configSelectors';
import {
    getAnimationExists,
    getAnimations,
    getSelections,
    getTargets,
} from '../../store/selectors/detectionSelectors';
import { getImageData, getVideo } from '../../store/selectors/videoSelectors';
import { Animation, blink, keyToPose, peek } from '../../utils/pose/animations';
import { ICoords } from '../../utils/types';
import Eye from './Eye';
import './Eye.css';
import { Gradients } from './Gradients';
import { Shadows } from './Shadows';
import { getBezier } from './utils/EyeShapeUtils';
import { confineToCircle } from './utils/MovementUtils';
import { getReflection } from './utils/ReflectionUtils';
import { generateInnerPath, irisMatrixTransform } from './utils/VisualUtils';

export interface IEyeControllerProps {
    environment: Window;
    dilation: number;
    openCoefficient: number;
    detected: boolean;
    isSleeping: boolean;
    target?: ICoords;
    appConfig?: IAppConfig;
}

interface IEyeControllerMapStateToProps {
    appConfig: IAppConfig;
    advancedConfig: IAdvancedConfig;
    target: ICoords;
    animation: Animation;
    animationExists: boolean;
    image?: HTMLVideoElement;
    selection?: IDetection;
    imageData?: ImageData;
}

interface IEyeControllerMapDispatchToState {
    updateAnimation: (animation: Animation) => ISetAnimationAction;
}

export type EyeControllerProps = IEyeControllerProps &
    IEyeControllerMapStateToProps &
    IEyeControllerMapDispatchToState;

export const EyeController = React.memo(
    (props: EyeControllerProps) => {
        const { environment, updateAnimation, animation } = props;
        const innerPath = useRef('');

        useEffect(() => {
            innerPath.current = generateInnerPath(
                eyeCoefficients.iris,
                numInnerEyeSectors,
            );
        }, []);

        const reflectionRef = useRef<ImageData | undefined>(undefined);

        const position =
            props.animationExists && animation[0].target
                ? confineToCircle(animation[0].target)
                : confineToCircle({
                      x: props.target.x * props.appConfig.xSensitivity,
                      y:
                          props.target.y *
                          props.appConfig.ySensitivity *
                          eyeSensitivityScale,
                  });

        const scale =
            (eyeCoefficients.sclera - eyeCoefficients.iris * minIrisScale) /
            minIrisScale;
        const target = {
            x: -position.x * scale,
            y: position.y * scale,
        };

        const frame = {
            openCoefficient: props.isSleeping
                ? eyelidPosition.CLOSED
                : props.openCoefficient,
            dilation: props.dilation,
            irisColor: props.appConfig.irisColor,
            duration: 1000 / props.appConfig.fps,
            ...animation[0],
            target,
        };

        const detectedRef = useRef(props.detected);

        useEffect(() => {
            detectedRef.current = props.detected;
        }, [props.detected]);

        useEffect(() => {
            return props.isSleeping
                ? peekHandler(environment, updateAnimation)
                : blinkHandler(environment, detectedRef, updateAnimation);
        }, [props.isSleeping, environment, updateAnimation, detectedRef]);

        useEffect(() => {
            if (props.animationExists) {
                const timer = environment.setTimeout(() => {
                    const myAnimation = [...animation];
                    myAnimation!.shift();
                    updateAnimation(myAnimation);
                }, animation[0].duration);
                return () => environment.clearTimeout(timer);
            }
        }, [animation, updateAnimation, environment, props.animationExists]);

        useEffect(() => {
            if (
                props.advancedConfig.toggleReflection &&
                props.image &&
                props.imageData
            ) {
                reflectionRef.current = getReflection(
                    props.target,
                    props.image,
                );
            } else {
                reflectionRef.current = undefined;
            }
        }, [
            props.target,
            props.image,
            props.advancedConfig.toggleReflection,
            props.imageData,
        ]);

        useEffect(() => {
            const handleKeyUpEventHandler = (event: KeyboardEvent) => {
                return handleKeyUp(event, updateAnimation);
            };

            environment.addEventListener('keyup', handleKeyUpEventHandler);
            return () =>
                environment.removeEventListener(
                    'keyup',
                    handleKeyUpEventHandler,
                );
        }, [environment, updateAnimation]);

        return (
            <div className="container">
                {[EyeSide.RIGHT, EyeSide.LEFT].map((eye, index) => {
                    const openCoefficient =
                        typeof frame.openCoefficient === 'number'
                            ? frame.openCoefficient
                            : frame.openCoefficient[eye];

                    const bezier = getBezier(openCoefficient);

                    return (
                        <Eye
                            {...props}
                            class={eye}
                            key={index}
                            animation={frame}
                            bezier={bezier}
                            reflection={reflectionRef.current}
                            innerPath={innerPath.current}
                            skewTransform={irisMatrixTransform(position)}
                            reflectionOpacity={
                                props.advancedConfig.reflectionOpacity
                            }
                            openCoefficient={openCoefficient}
                        />
                    );
                })}
                <Gradients
                    irisColor={frame.irisColor}
                    reflectionOpacity={props.advancedConfig.reflectionOpacity}
                />
                <Shadows openCoefficient={props.openCoefficient} />
            </div>
        );
    },
    (previous, next) =>
        isEqual(previous.animation, next.animation) &&
        previous.dilation === next.dilation &&
        previous.openCoefficient === next.openCoefficient &&
        previous.target.x === next.target.x &&
        previous.target.y === next.target.y &&
        previous.isSleeping === next.isSleeping,
);

function blinkHandler(
    environment: Window,
    detectedRef: MutableRefObject<boolean>,
    updateAnimation: (animation: Animation) => ISetAnimationAction,
) {
    let blinkInterval = environment.setInterval(() => {
        const blinkFrequency = detectedRef.current
            ? blinkConsts.focusedFrequency
            : blinkConsts.frequency;

        const blinkProbability =
            blinkFrequency / (1000 / transitionTimes.blink);

        if (Math.random() < blinkProbability) {
            updateAnimation(blink());
        }
    }, transitionTimes.blink);

    return () => {
        environment.clearInterval(blinkInterval);
        blinkInterval = 0;
    };
}

function peekHandler(
    environment: Window,
    updateAnimation: (animation: Animation) => ISetAnimationAction,
) {
    let peekInterval = environment.setInterval(() => {
        const peekProbability =
            blinkConsts.peekFrequency / (1000 / transitionTimes.peek);

        if (Math.random() < peekProbability) {
            const random = Math.random();
            updateAnimation(peek(random > 0.1, random < 0.9));
        }
    }, transitionTimes.peek);

    return () => {
        environment.clearInterval(peekInterval);
        peekInterval = 0;
    };
}

function handleKeyUp(
    event: KeyboardEvent,
    updateAnimation: (animation: Animation) => ISetAnimationAction,
) {
    const keyAnimation = keyToPose[event.key];
    if (keyAnimation) {
        updateAnimation(keyAnimation());
    }
}

const mapStateToProps = (state: IRootStore): IEyeControllerMapStateToProps => ({
    appConfig: getAppConfig(state),
    advancedConfig: getAdvancedConfig(state),
    target: getTargets(state),
    image: getVideo(state),
    selection: getSelections(state),
    animation: getAnimations(state),
    animationExists: getAnimationExists(state),
    imageData: getImageData(state),
});

const mapDispatchToProps = (
    dispatch: Dispatch,
): IEyeControllerMapDispatchToState => ({
    updateAnimation: (animation: Animation) =>
        dispatch(setAnimation(animation)),
});

const mergeProps = (
    stateProps: IEyeControllerMapStateToProps,
    dispatchProps: IEyeControllerMapDispatchToState,
    ownProps: IEyeControllerProps,
): EyeControllerProps => {
    const props: EyeControllerProps = {
        ...ownProps,
        ...stateProps,
        ...dispatchProps,
    };
    props.appConfig = ownProps.appConfig || stateProps.appConfig;
    props.target = ownProps.target || stateProps.target;
    return props;
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
)(EyeController);
