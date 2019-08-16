import React, { useEffect, useRef, useState } from 'react';
import isEqual from 'react-fast-compare';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    blinkConsts,
    eyeCoefficients,
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
import { getVideo } from '../../store/selectors/videoSelectors';
import { Animation, blink } from '../../utils/pose/animations';
import { ICoords } from '../../utils/types';
import Eye from './Eye';
import './Eye.css';
import { Gradients } from './Gradients';
import { Shadows } from './Shadows';
import { confineToCircle } from './utils/MovementUtils';
import { getReflection } from './utils/ReflectionUtils';
import { generateInnerPath, irisMatrixTransform } from './utils/VisualUtils';

interface IEyeControllerProps {
    width: number;
    height: number;
    environment: Window;
    dilation: number;
    openCoefficient: number;
    detected: boolean;
}

interface IEyeControllerMapStateToProps {
    appConfig: IAppConfig;
    advancedConfig: IAdvancedConfig;
    target: ICoords;
    animation: Animation;
    animationExists: boolean;
    image?: HTMLVideoElement;
    selection?: IDetection;
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

        const scleraRadius = Math.floor(props.width * eyeCoefficients.sclera);
        const irisRadius = Math.floor(props.width * eyeCoefficients.iris);
        const pupilRadius = Math.floor(props.width * eyeCoefficients.pupil);

        const reflectionRef = useRef<ImageData | undefined>(undefined);

        const position =
            props.animationExists && animation[0].target
                ? confineToCircle(animation[0].target)
                : confineToCircle({
                      x: props.target.x * props.appConfig.xSensitivity,
                      y: props.target.y * props.appConfig.ySensitivity,
                  });

        const scale = (scleraRadius - irisRadius * minIrisScale) / minIrisScale;
        const target = {
            x: props.width / 4 + -position.x * scale,
            y: props.height / 2 + position.y * scale,
        };

        const frame = {
            openCoefficient: props.openCoefficient,
            dilation: props.dilation,
            irisColor: props.appConfig.irisColor,
            duration: 1000 / props.appConfig.fps,
            ...animation[0],
            target,
        };

        const [innerPath, setInnerPath] = useState(
            generateInnerPath(irisRadius, numInnerEyeSectors),
        );

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
        }, [environment, updateAnimation]);

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
            if (props.advancedConfig.toggleReflection && props.image) {
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
            props.advancedConfig.toggleReflection,
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
                        typeof frame.openCoefficient === 'number'
                            ? frame.openCoefficient
                            : frame.openCoefficient[eye],
                    );

                    const eyeShape = getEyeShape(
                        props.width,
                        props.height,
                        scleraRadius,
                        typeof frame.openCoefficient === 'number'
                            ? frame.openCoefficient
                            : frame.openCoefficient[eye],
                    );
                    return (
                        <Eye
                            {...props}
                            class={eye}
                            key={index}
                            width={props.width / 2}
                            animation={frame}
                            scleraRadius={scleraRadius}
                            irisRadius={irisRadius}
                            pupilRadius={pupilRadius}
                            bezier={bezier}
                            eyeShape={eyeShape}
                            reflection={reflectionRef.current}
                            innerPath={innerPath}
                            skewTransform={irisMatrixTransform(position)}
                            reflectionOpacity={props.config.reflectionOpacity}
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
        previous.height === next.height &&
        previous.width === next.width,
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
    appConfig: getAppConfig(state),
    advancedConfig: getAdvancedConfig(state),
    target: getTargets(state),
    image: getVideo(state),
    selection: getSelections(state),
    animation: getAnimations(state),
    animationExists: getAnimationExists(state),
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
