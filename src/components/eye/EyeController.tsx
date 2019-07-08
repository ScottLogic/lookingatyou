import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
    eyelidPosition,
    eyes,
    neutralBlinkFrequency,
    pupilSizes,
    transitionTime,
} from '../../AppConstants';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getConfig } from '../../store/selectors/configSelectors';
import { ICoords, ITargets } from '../../utils/types';
import IUserConfig from '../configMenu/IUserConfig';
import Eye from './Eye';
import { getFatigueMultiplier } from './EyeUtils';
import { Gradients } from './Gradients';
interface IEyeControllerProps {
    width: number;
    height: number;
    environment: Window;
}
interface IEyeControllerMapStateToProps {
    config: IUserConfig;
    dilation: number;
    openCoefficient: number;
    detected: boolean;
    target: ITargets;
}
export type EyeControllerProps = IEyeControllerProps &
    IEyeControllerMapStateToProps;
const mapStateToProps = (state: IRootStore): IEyeControllerMapStateToProps => ({
    config: getConfig(state),
    target: state.detectionStore.target,
    dilation: state.detectionStore.dilationCoefficient,
    openCoefficient: state.detectionStore.eyesOpenCoefficient,
    detected: state.detectionStore.personDetected,
});
export const EyeController = React.memo(
    (props: EyeControllerProps) => {
        const [blinkFrequencyCoefficient] = useState(1); // Will change based on camera feed e.g. lower coefficient when object in frame
        const [isBlinking, setIsBlinking] = useState(false); // Will change based on camera feed e.g. blink less when object in frame
        const [eyesOpenCoefficient] = useState(eyelidPosition.OPEN); // Will change based on camera feed e.g. higher coefficient to show surprise
        const [dilationCoefficient] = useState(pupilSizes.neutral); // Will change based on camera feed e.g. briefly increase coefficient (dilate) when object enters frame then reset to 1 (neutral)
        const [fatigueMultiplier] = useState(getFatigueMultiplier());

        useEffect(() => {
            const blink = props.environment.setInterval(() => {
                if (isBlinking) {
                    setIsBlinking(false);
                } else {
                    const blinkFrequency = props.detected
                        ? neutralBlinkFrequency / 4
                        : neutralBlinkFrequency;
                    const blinkProbability =
                        (blinkFrequency * blinkFrequencyCoefficient) /
                        (1000 / (transitionTime.blink * fatigueMultiplier));
                    setIsBlinking(
                        Math.random() * fatigueMultiplier < blinkProbability,
                    );
                }
            }, transitionTime.blink);
            return () => {
                props.environment.clearInterval(blink);
            };
        }, [
            props.detected,
            props.environment,
            isBlinking,
            blinkFrequencyCoefficient,
            dilationCoefficient,
        ]);

        const scleraRadius = props.width / 4.5;
        const irisRadius = props.width / 10;
        const pupilRadius = props.width / 24;

        const getEyeCoords = (target: ICoords): ICoords => {
            const maxDisplacement = scleraRadius - irisRadius;
            const targetY = target.y * props.config.ySensitivity;
            const targetX = -target.x * props.config.xSensitivity; // mirrored
            const polarDistance = Math.hypot(targetY, targetX);
            const polarAngle = Math.atan2(targetY, targetX);
            const displacement = Math.min(1, polarDistance) * maxDisplacement;
            const x = props.width / 4 + displacement * Math.cos(polarAngle);
            const y = props.height / 2 + displacement * Math.sin(polarAngle);
            return { x, y };
        };

        const eyeCoords: { [key: string]: ICoords } = {};
        eyeCoords[eyes.LEFT] = getEyeCoords(props.target.left);
        const right = props.target.right;
        eyeCoords[eyes.RIGHT] =
            right === null ? eyeCoords[eyes.LEFT] : getEyeCoords(right);

        function getEyesOpenCoefficient(): number {
            if (props.openCoefficient !== eyesOpenCoefficient) {
                return props.openCoefficient;
            } else if (isBlinking) {
                return 0;
            } else {
                return eyesOpenCoefficient;
            }
        }

        return (
            <div className="container">
                {Object.values(eyes).map((eye, key) => {
                    return (
                        <Eye
                            class={eye}
                            key={key}
                            width={props.width / 2}
                            height={props.height}
                            irisColor={props.config.irisColor}
                            scleraRadius={scleraRadius}
                            irisRadius={irisRadius}
                            pupilRadius={pupilRadius}
                            // 1 is neutral eye position; 0 or less is fully closed; larger than 1 makes eye look shocked
                            openCoefficient={getEyesOpenCoefficient()}
                            // factor by which to multiply the pupil radius - e.g. 0 is non-existant pupil, 1 is no dilation, 2 is very dilated
                            dilatedCoefficient={props.dilation}
                            innerX={eyeCoords[eye].x}
                            innerY={eyeCoords[eye].y}
                            fps={props.config.fps}
                        />
                    );
                })}
                <Gradients irisColor={props.config.irisColor} />
            </div>
        );
    },
    (previous, next) =>
        previous.target.left.x === next.target.left.x &&
        previous.target.left.y === next.target.left.y &&
        previous.target.right === next.target.right &&
        (previous.target.right === null ||
            (previous.target.right.x === next.target.right!.x &&
                previous.target.right.y === next.target.right!.y)),
);

export default connect(mapStateToProps)(EyeController);
