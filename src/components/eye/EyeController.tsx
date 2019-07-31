import React, { useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    blinkConsts,
    eyelidPosition,
    eyeRatio,
    EyeSide,
    transitionTimes,
} from '../../AppConstants';
import { IConfigState } from '../../store/actions/config/types';
import { setAnimation } from '../../store/actions/detections/actions';
import { ISetAnimationAction } from '../../store/actions/detections/types';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getConfig } from '../../store/selectors/configSelectors';
import { getTargets } from '../../store/selectors/detectionSelectors';
import { getVideo } from '../../store/selectors/videoSelectors';
import { normalise } from '../../utils/objectTracking/calculateFocus';
import { Animation } from '../../utils/pose/animations';
import { ICoords } from '../../utils/types';
import Eye from './Eye';
import { getMaxDisplacement } from './EyeUtils';
import { Gradients } from './Gradients';
import { Shadows } from './Shadows';

interface IEyeControllerProps {
    width: number;
    height: number;
    environment: Window;
    dilation: number;
    detected: boolean;
    openCoefficient: number;
}

interface IEyeControllerMapStateToProps {
    config: IConfigState;
    target: ICoords;
    video: HTMLVideoElement | undefined;
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
        const [blinkFrequencyCoefficient] = useState(1); // Will change based on camera feed e.g. lower coefficient when object in frame
        const [isBlinking, setIsBlinking] = useState(false); // Will change based on camera feed e.g. blink less when object in frame
        const [eyesOpenCoefficient] = useState(eyelidPosition.OPEN); // Will change based on camera feed e.g. higher coefficient to show surprise

        const { environment, updateAnimation, animation } = props;

        useEffect(() => {
            if (animation.length === 0) {
                let blink = environment.setInterval(() => {
                    if (isBlinking) {
                        setIsBlinking(false);
                    } else {
                        const blinkFrequency = props.detected
                            ? blinkConsts.frequency / 4
                            : blinkConsts.frequency;
                        const blinkProbability =
                            (blinkFrequency * blinkFrequencyCoefficient) /
                            (1000 / transitionTimes.blink);
                        setIsBlinking(Math.random() < blinkProbability);
                    }
                }, transitionTimes.blink);
                return () => {
                    environment.clearInterval(blink);
                    blink = 0;
                };
            }
        }, [
            props.detected,
            environment,
            isBlinking,
            blinkFrequencyCoefficient,
            animation,
        ]);

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

        const scleraRadius = props.width / eyeRatio.sclera;
        const irisRadius = props.width / eyeRatio.iris;
        const pupilRadius = props.width / eyeRatio.pupil;

        const getEyeCoords = (target: ICoords): ICoords => {
            const maxDisplacement = getMaxDisplacement(
                scleraRadius,
                irisRadius,
            );
            const targetY = target.y * props.config.ySensitivity;
            const targetX = -target.x * props.config.xSensitivity; // mirrored
            const polarDistance = Math.hypot(targetY, targetX);
            const polarAngle = Math.atan2(targetY, targetX);
            const displacement = Math.min(1, polarDistance) * maxDisplacement;
            const x = props.width / 4 + displacement * Math.cos(polarAngle);
            const y = props.height / 2 + displacement * Math.sin(polarAngle);
            return { x, y };
        };
        const leftCoords = getEyeCoords(props.target);
        const eyeCoords: { [key in EyeSide]: ICoords } =
            props.animation.length > 0 &&
            props.animation[0].normalisedCoords !== undefined
                ? centerAnimationCoords()
                : {
                      LEFT: leftCoords,
                      RIGHT: leftCoords,
                  };

        function centerAnimationCoords() {
            const animationX = props.animation[0].normalisedCoords!.x;
            const animationY = props.animation[0].normalisedCoords!.y;
            return {
                LEFT: {
                    x: normalise(animationX, 1, -1, props.width / 2),
                    y: normalise(animationY, 1, -1, props.width / 2),
                },
                RIGHT: {
                    x: normalise(animationX, 1, -1, props.width / 2),
                    y: normalise(animationY, 1, -1, props.width / 2),
                },
            };
        }

        function getEyesOpenCoefficient(): number {
            if (props.openCoefficient !== eyesOpenCoefficient) {
                return props.openCoefficient;
            } else if (isBlinking) {
                return 0;
            } else {
                return eyesOpenCoefficient;
            }
        }

        const calculatedEyesOpenCoefficient =
            props.animation.length > 0 && props.animation[0].openCoefficient
                ? props.animation[0].openCoefficient
                : getEyesOpenCoefficient();

        const dilatedCoefficient =
            props.animation.length > 0 && props.animation[0].dilation
                ? props.animation[0].dilation
                : props.dilation;

        const irisColor =
            props.animation.length > 0 && props.animation[0].irisColor
                ? props.animation[0].irisColor
                : props.config.irisColor;

        return (
            <div className="container">
                {[EyeSide.RIGHT, EyeSide.LEFT].map((eye, index) => {
                    const bezier = getBezier(
                        scleraRadius,
                        typeof calculatedEyesOpenCoefficient === 'number'
                            ? calculatedEyesOpenCoefficient
                            : calculatedEyesOpenCoefficient[eye],
                    );

                    const eyeCoordsItem = getEyeCoordinates(
                        props.width,
                        props.height,
                        scleraRadius,
                        typeof calculatedEyesOpenCoefficient === 'number'
                            ? calculatedEyesOpenCoefficient
                            : calculatedEyesOpenCoefficient[eye],
                    );

                    return (
                        <Eye
                            class={eye}
                            key={index}
                            width={props.width / 2}
                            height={props.height}
                            irisColor={irisColor}
                            scleraRadius={scleraRadius}
                            irisRadius={irisRadius}
                            pupilRadius={pupilRadius}
                            // factor by which to multiply the pupil radius - e.g. 0 is non-existant pupil, 1 is no dilation, 2 is very dilated
                            dilatedCoefficient={dilatedCoefficient}
                            innerX={eyeCoords[eye].x}
                            innerY={eyeCoords[eye].y}
                            fps={props.config.fps}
                            bezier={bezier}
                            eyeCoords={eyeCoordsItem}
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

const mapStateToProps = (state: IRootStore): IEyeControllerMapStateToProps => ({
    config: getConfig(state),
    target: getTargets(state),
    video: getVideo(state),
    animation: state.detectionStore.animation,
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

export function getBezier(scleraRadius: number, openCoefficient: number) {
    const curveConstant = 0.55228474983; // (4/3)tan(pi/8)
    const controlOffset = scleraRadius * curveConstant;
    const scaledYcontrolOffset = controlOffset * openCoefficient;
    const scaledXcontrolOffset = controlOffset - scaledYcontrolOffset;
    return { controlOffset, scaledXcontrolOffset, scaledYcontrolOffset };
}

export function getEyeCoordinates(
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
