import React, { useEffect, useState } from 'react';
import {
    colours,
    eyelidPosition,
    eyes,
    neutralBlinkFrequency,
    pupilSizes,
    transitionTime,
} from '../../AppConstants';
import InterfaceUserConfig from '../configMenu/InterfaceUserConfig';
import Eye from './Eye';
interface IEyeControllerProps {
    width: number;
    height: number;
    userConfig: InterfaceUserConfig;
    environment: Window;
    targetX: number;
    targetY: number;
    openCoefficient: number;
    dilationCoefficient: number;
}
export default function EyeController(props: IEyeControllerProps) {
    const [blinkFrequencyCoefficient] = useState(1); // Will change based on camera feed e.g. lower coefficient when object in frame
    const [isBlinking, setIsBlinking] = useState(false); // Will change based on camera feed e.g. blink less when object in frame
    const [eyesOpenCoefficient] = useState(eyelidPosition.OPEN); // Will change based on camera feed e.g. higher coefficient to show surprise
    const [dilationCoefficient] = useState(pupilSizes.neutral); // Will change based on camera feed e.g. briefly increase coefficient (dilate) when object enters frame then reset to 1 (neutral)

    useEffect(() => {
        const blink = props.environment.setInterval(() => {
            if (isBlinking) {
                setIsBlinking(false);
            } else {
                const blinkProbability =
                    (neutralBlinkFrequency * blinkFrequencyCoefficient) /
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
    const scleraRadius = props.width / 5;
    const irisRadius = props.width / 10;
    const pupilRadius = props.width / 24;
    const maxDisplacement = scleraRadius - irisRadius;
    const targetY = props.targetY * props.userConfig.ySensitivity;
    const targetX = -props.targetX * props.userConfig.xSensitivity; // mirrored
    const polarDistance = Math.hypot(targetY, targetX);
    const polarAngle = Math.atan2(targetY, targetX);
    const displacement = Math.min(1, polarDistance) * maxDisplacement;
    const innerX = props.width / 4 + displacement * Math.cos(polarAngle);
    const innerY = props.height / 2 + displacement * Math.sin(polarAngle);

    return (
        <div className="container">
            {Object.values(eyes).map((eye, key) => {
                return (
                    <Eye
                        class={eye}
                        key={key}
                        width={props.width / 2}
                        height={props.height}
                        scleraColor={colours.scleraColor}
                        irisColor={props.userConfig.irisColor}
                        pupilColor={colours.pupilColor}
                        scleraRadius={scleraRadius}
                        irisRadius={irisRadius}
                        pupilRadius={pupilRadius}
                        // 1 is neutral eye position; 0 or less is fully closed; larger than 1 makes eye look shocked
                        openCoefficient={
                            props.openCoefficient === eyelidPosition.SQUINT
                                ? eyelidPosition.SQUINT
                                : isBlinking
                                ? 0
                                : eyesOpenCoefficient
                        }
                        // factor by which to multiply the pupil radius - e.g. 0 is non-existant pupil, 1 is no dilation, 2 is very dilated
                        dilatedCoefficient={props.dilationCoefficient}
                        innerX={innerX}
                        innerY={innerY}
                    />
                );
            })}
        </div>
    );
}
