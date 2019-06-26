import React, { useEffect, useState } from 'react';
import {
    colours,
    eyelidPosition,
    eyes,
    neutralBlinkFrequency,
    pupilSizes,
    transitionTime,
} from '../../AppConstants';
import IUserConfig from '../configMenu/InterfaceUserConfig';
import Eye from './Eye';
interface IEyeControllerProps {
    width: number;
    height: number;
    userConfig: IUserConfig;
    environment: Window;
    targetX: number;
    targetY: number;
}
export default function EyeController(props: IEyeControllerProps) {
    const [blinkFrequencyCoefficient] = useState(1); // Will change based on camera feed e.g. lower coefficient when object in frame
    const [isBlinking, setIsBlinking] = useState(false); // Will change based on camera feed e.g. blink less when object in frame
    const [eyesOpenCoefficient] = useState(eyelidPosition.OPEN); // Will change based on camera feed e.g. higher coefficient to show surprise
    const [dilationCoefficient, setDilationCoefficient] = useState(1); // Will change based on camera feed e.g. briefly increase coefficient (dilate) when object enters frame then reset to 1 (neutral)

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
    });

    useEffect(() => {
        const dilateInterval = 1000;
        const dilate = props.environment.setInterval(() => {
            switch (dilationCoefficient) {
                case pupilSizes.neutral:
                    setDilationCoefficient(pupilSizes.dilated);
                    return;
                case pupilSizes.dilated:
                    setDilationCoefficient(pupilSizes.constricted);
                    return;
                default:
                    setDilationCoefficient(pupilSizes.neutral);
                    return;
            }
        }, dilateInterval);
        return () => {
            props.environment.clearInterval(dilate);
        };
    });

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
                        scleraRadius={props.width / 5}
                        irisRadius={props.width / 10}
                        pupilRadius={props.width / 24}
                        // 1 is neutral eye position; 0 or less is fully closed; larger than 1 makes eye look shocked
                        openCoefficient={isBlinking ? 0 : eyesOpenCoefficient}
                        // factor by which to multiply the pupil radius - e.g. 0 is non-existant pupil, 1 is no dilation, 2 is very dilated
                        dilatedCoefficient={dilationCoefficient}
                        innerX={props.targetX}
                        innerY={props.targetY}
                    />
                );
            })}
        </div>
    );
}
