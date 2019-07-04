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
import { ICoords } from '../../utils/types';
import IUserConfig from '../configMenu/IUserConfig';
import Eye from './Eye';
import { Gradients } from './Gradients';
interface IEyeControllerProps {
    width: number;
    height: number;
    environment: Window;
}
interface IEyeControllerMapStateToProps {
    config: IUserConfig;
    target: ICoords;
    dilation: number;
    openCoefficient: number;
    detected: boolean;
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
                        (1000 / transitionTime.blink);
                    setIsBlinking(Math.random() < blinkProbability);
                }
            }, transitionTime.blink);
            return () => {
                props.environment.clearInterval(blink);
            };
        }, [
            props.environment,
            isBlinking,
            blinkFrequencyCoefficient,
            dilationCoefficient,
        ]);
        const scleraRadius = props.width / 4.5;
        const irisRadius = props.width / 10;
        const pupilRadius = props.width / 24;
        const maxDisplacement = scleraRadius - irisRadius;
        const targetY = props.target.y * props.config.ySensitivity;
        const targetX = -props.target.x * props.config.xSensitivity; // mirrored
        const polarDistance = Math.hypot(targetY, targetX);
        const polarAngle = Math.atan2(targetY, targetX);
        const displacement = Math.min(1, polarDistance) * maxDisplacement;
        const innerX = props.width / 4 + displacement * Math.cos(polarAngle);
        const innerY = props.height / 2 + displacement * Math.sin(polarAngle);

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
                            innerX={innerX}
                            innerY={innerY}
                            fps={props.config.fps}
                        />
                    );
                })}
                <Gradients irisColor={props.config.irisColor} />
            </div>
        );
    },
    (previous, next) =>
        previous.target.x === next.target.x &&
        previous.target.y === next.target.y,
);

export default connect(mapStateToProps)(EyeController);
