import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
    eyelidPosition,
    EyeSide,
    neutralBlinkFrequency,
    transitionTime,
} from '../../AppConstants';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getConfig } from '../../store/selectors/configSelectors';
import {
    getOpenCoefficient,
    getTargets,
} from '../../store/selectors/detectionSelectors';
import { getVideos } from '../../store/selectors/videoSelectors';
import { ICoords } from '../../utils/types';
import IUserConfig from '../configMenu/IUserConfig';
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
}

interface IEyeControllerMapStateToProps {
    config: IUserConfig;
    target: ICoords;
    videos: Array<HTMLVideoElement | undefined>;
    openCoefficient: number;
}

export type EyeControllerProps = IEyeControllerProps &
    IEyeControllerMapStateToProps;

export const EyeController = React.memo(
    (props: EyeControllerProps) => {
        const [blinkFrequencyCoefficient] = useState(1); // Will change based on camera feed e.g. lower coefficient when object in frame
        const [isBlinking, setIsBlinking] = useState(false); // Will change based on camera feed e.g. blink less when object in frame
        const [eyesOpenCoefficient] = useState(eyelidPosition.OPEN); // Will change based on camera feed e.g. higher coefficient to show surprise

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
            props.detected,
            props.environment,
            isBlinking,
            blinkFrequencyCoefficient,
        ]);

        const scleraRadius = props.width / 4.5;
        const irisRadius = props.width / 10;
        const pupilRadius = props.width / 24;

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
        const eyeCoords: { [key in EyeSide]: ICoords } = {
            LEFT: leftCoords,
            RIGHT: leftCoords,
        };

        function getEyesOpenCoefficient(): number {
            if (props.openCoefficient !== eyesOpenCoefficient) {
                return props.openCoefficient;
            } else if (isBlinking) {
                return 0;
            } else {
                return eyesOpenCoefficient;
            }
        }

        const calculatedEyesOpenCoefficient = getEyesOpenCoefficient();

        return (
            <div className="container">
                {[EyeSide.RIGHT, EyeSide.LEFT].map((eye, index) => {
                    return (
                        <Eye
                            class={eye}
                            key={index}
                            width={props.width / 2}
                            height={props.height}
                            irisColor={props.config.irisColor}
                            scleraRadius={scleraRadius}
                            irisRadius={irisRadius}
                            pupilRadius={pupilRadius}
                            // 1 is neutral eye position; 0 or less is fully closed; larger than 1 makes eye look shocked
                            openCoefficient={calculatedEyesOpenCoefficient}
                            // factor by which to multiply the pupil radius - e.g. 0 is non-existant pupil, 1 is no dilation, 2 is very dilated
                            dilatedCoefficient={props.dilation}
                            innerX={eyeCoords[eye].x}
                            innerY={eyeCoords[eye].y}
                            fps={props.config.fps}
                            bezier={getBezier(
                                scleraRadius,
                                calculatedEyesOpenCoefficient,
                            )}
                            eyeCoords={getEyeCoordinates(
                                props.width,
                                props.height,
                                scleraRadius,
                                calculatedEyesOpenCoefficient,
                            )}
                        />
                    );
                })}
                <Gradients irisColor={props.config.irisColor} />
                <Shadows openCoefficient={props.openCoefficient} />
            </div>
        );
    },
    (previous, next) =>
        previous.dilation === next.dilation &&
        previous.openCoefficient === next.openCoefficient &&
        previous.target.x === next.target.x &&
        previous.target.y === next.target.y,
);

const mapStateToProps = (state: IRootStore): IEyeControllerMapStateToProps => ({
    config: getConfig(state),
    target: getTargets(state),
    videos: getVideos(state),
    openCoefficient: getOpenCoefficient(state),
});

export default connect(mapStateToProps)(EyeController);

function getBezier(scleraRadius: number, openCoefficient: number) {
    const curveConstant = 0.55228474983; // (4/3)tan(pi/8)
    const controlOffset = scleraRadius * curveConstant;
    const scaledYcontrolOffset = controlOffset * openCoefficient;
    const scaledXcontrolOffset = controlOffset - scaledYcontrolOffset;
    return { controlOffset, scaledXcontrolOffset, scaledYcontrolOffset };
}

function getEyeCoordinates(
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
