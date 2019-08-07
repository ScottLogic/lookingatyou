import React, { useEffect, useRef, useState } from 'react';
import isEqual from 'react-fast-compare';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    blinkConsts,
    eyelidPosition,
    eyeRadiiCoefficients,
    EyeSide,
    minIrisScale,
    numInnerEyeSectors,
    transitionTimes,
} from '../../AppConstants';
import { IDetection } from '../../models/objectDetection';
import { IConfigState } from '../../store/actions/config/types';
import { setAnimation } from '../../store/actions/detections/actions';
import { ISetAnimationAction } from '../../store/actions/detections/types';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getConfig } from '../../store/selectors/configSelectors';
import {
    getAnimations,
    getSelections,
    getTargets,
} from '../../store/selectors/detectionSelectors';
import { getVideo } from '../../store/selectors/videoSelectors';
import { Animation, blink, peek } from '../../utils/pose/animations';
import { ICoords } from '../../utils/types';
import Eye from './Eye';
import { Gradients } from './Gradients';
import { Shadows } from './Shadows';
import { getReflection } from './utils/ReflectionUtils';
import { generateInnerPath, irisMatrixTransform } from './utils/VisualUtils';

interface IEyeControllerProps {
    width: number;
    height: number;
    environment: Window;
    dilation: number;
    openCoefficient: number;
    detected: boolean;
    isSleeping: boolean;
}

interface IEyeControllerMapStateToProps {
    config: IConfigState;
    target: ICoords;
    image: HTMLVideoElement | undefined;
    selection: IDetection | undefined;
    animation: Animation;
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

        const scleraRadius = Math.floor(
            props.width * eyeRadiiCoefficients.sclera,
        );
        const irisRadius = Math.floor(props.width * eyeRadiiCoefficients.iris);
        const pupilRadius = Math.floor(
            props.width * eyeRadiiCoefficients.pupil,
        );

        const reflectionRef = useRef<ImageData | undefined>(undefined);

        const target =
            props.animation.length > 0 && props.animation[0].normalisedCoords
                ? props.animation[0].normalisedCoords
                : {
                      x: props.target.x * props.config.xSensitivity,
                      y: props.target.y * props.config.ySensitivity,
                  };

        const maxDisplacement =
            (scleraRadius - irisRadius * minIrisScale) / minIrisScale;
        const polarDistance = Math.hypot(target.y, -target.x);
        const polarAngle = Math.atan2(target.y, -target.x);
        const displacement = Math.min(1, polarDistance) * maxDisplacement;
        const innerX = props.width / 4 + displacement * Math.cos(polarAngle);
        const innerY = props.height / 2 + displacement * Math.sin(polarAngle);
        const innerCenter = { x: innerX, y: innerY };

        const calculatedEyesOpenCoefficient =
            props.animation.length > 0 &&
            props.animation[0].hasOwnProperty('openCoefficient')
                ? props.animation[0].openCoefficient!
                : props.isSleeping
                ? eyelidPosition.CLOSED
                : props.openCoefficient;

        const dilatedCoefficient =
            props.animation.length > 0 &&
            props.animation[0].dilation !== undefined
                ? props.animation[0].dilation
                : props.dilation;

        const [innerPath, setInnerPath] = useState(
            generateInnerPath(irisRadius, numInnerEyeSectors),
        );

        const irisColor =
            props.animation.length > 0 && props.animation[0].irisColor
                ? props.animation[0].irisColor
                : props.config.irisColor;

        const animationRef = useRef(animation);
        const detectedRef = useRef(props.detected);
        useEffect(() => {
            detectedRef.current = props.detected;
        }, [props.detected]);
        useEffect(() => {
            animationRef.current = animation;
        }, [animation]);

        useEffect(() => {
            if (animationRef.current.length === 0) {
                if (props.isSleeping) {
                    let peekInterval = environment.setInterval(() => {
                        const peekProbability =
                            blinkConsts.peekFrequency /
                            (1000 / transitionTimes.peek);
                        if (Math.random() < peekProbability) {
                            const random = Math.random();
                            if (random < 1 / 3) {
                                updateAnimation(peek(true, false));
                            } else if (random < 2 / 3) {
                                updateAnimation(peek(false, true));
                            } else {
                                updateAnimation(peek(true, true));
                            }
                        }
                    }, transitionTimes.peek);
                    return () => {
                        environment.clearInterval(peekInterval);
                        peekInterval = 0;
                    };
                } else {
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
            }
        }, [props.isSleeping, environment, updateAnimation]);

        useEffect(() => {
            if (animation.length > 0) {
                const timer = environment.setTimeout(() => {
                    const myAnimation = [...animation];
                    myAnimation!.shift();
                    updateAnimation(myAnimation);
                }, animation[0].duration);
                return () => environment.clearTimeout(timer);
            }
        }, [animation, updateAnimation, environment]);

        useEffect(() => {
            if (props.config.toggleReflection && props.image) {
                reflectionRef.current = getReflection(
                    pupilRadius,
                    props.target,
                    props.image,
                );
            } else {
                reflectionRef.current = undefined;
            }
        }, [
            props.target,
            props.image,
            props.config.toggleReflection,
            pupilRadius,
        ]);

        useEffect(() => {
            setInnerPath(generateInnerPath(irisRadius, 100));
        }, [irisRadius]);

        return (
            <div className="container">
                {[EyeSide.RIGHT, EyeSide.LEFT].map((eye, index) => {
                    const bezier = getBezier(
                        scleraRadius,
                        typeof calculatedEyesOpenCoefficient === 'number'
                            ? calculatedEyesOpenCoefficient
                            : calculatedEyesOpenCoefficient[eye],
                    );

                    const eyeShape = getEyeShape(
                        props.width,
                        props.height,
                        scleraRadius,
                        typeof calculatedEyesOpenCoefficient === 'number'
                            ? calculatedEyesOpenCoefficient
                            : calculatedEyesOpenCoefficient[eye],
                    );
                    return (
                        <Eye
                            {...props}
                            class={eye}
                            key={index}
                            width={props.width / 2}
                            irisColor={irisColor}
                            scleraRadius={scleraRadius}
                            irisRadius={irisRadius}
                            pupilRadius={pupilRadius}
                            dilatedCoefficient={dilatedCoefficient}
                            innerCenter={innerCenter}
                            fps={props.config.fps}
                            bezier={bezier}
                            eyeShape={eyeShape}
                            reflection={reflectionRef.current}
                            innerPath={innerPath}
                            skewTransform={irisMatrixTransform(target)}
                            transformDuration={
                                props.animation.length > 0
                                    ? props.animation[0].duration
                                    : undefined
                            }
                        />
                    );
                })}
                <Gradients
                    irisColor={irisColor}
                    reflectionOpacity={props.config.reflectionOpacity}
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
        previous.target.y === next.target.y,
);

export function getBezier(scleraRadius: number, openCoefficient: number) {
    const curveConstant = 0.55228474983; // (4/3)tan(pi/8)
    const controlOffset = scleraRadius * curveConstant;
    const scaledYcontrolOffset = controlOffset * openCoefficient;
    const scaledXcontrolOffset = controlOffset - scaledYcontrolOffset;
    return { controlOffset, scaledXcontrolOffset, scaledYcontrolOffset };
}

export function getEyeShape(
    width: number,
    height: number,
    scleraRadius: number,
    openCoefficient: number,
) {
    const middleX = width / 4;
    const leftX = middleX - scleraRadius;
    const rightX = middleX + scleraRadius;
    const middleY = height / 2;

    const topEyelidY = middleY - scleraRadius * openCoefficient;
    const bottomEyelidY = middleY + scleraRadius * openCoefficient;

    return {
        middleX,
        leftX,
        rightX,
        middleY,
        topEyelidY,
        bottomEyelidY,
    };
}

const mapStateToProps = (state: IRootStore): IEyeControllerMapStateToProps => ({
    config: getConfig(state),
    target: getTargets(state),
    image: getVideo(state),
    selection: getSelections(state),
    animation: getAnimations(state),
});

const mapDispatchToProps = (
    dispatch: Dispatch,
): IEyeControllerMapDispatchToState => ({
    updateAnimation: (animation: Animation) =>
        dispatch(setAnimation(animation)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(EyeController);
