import {
    eyelidPosition,
    EyeSide,
    idleMovementConsts,
    Pose,
    pupilSizes,
    transitionTimes,
} from '../../AppConstants';
import { normalise } from '../objectTracking/calculateFocus';
import { ICoords } from '../types';

export interface IAnimationFrame {
    target?: ICoords;
    openCoefficient?:
        | number
        | { [EyeSide.LEFT]: number; [EyeSide.RIGHT]: number };
    dilation?: number;
    irisColor?: string;
    duration: number;
}

export type Animation = IAnimationFrame[];

export const wink = {
    openCoefficient: eyelidPosition.OPEN,
    duration: 500,
};

export const leftWink: Animation = [
    {
        openCoefficient: {
            [EyeSide.LEFT]: eyelidPosition.CLOSED,
            [EyeSide.RIGHT]: eyelidPosition.OPEN,
        },
        duration: 500,
    },
    wink,
];

export const rightWink: Animation = [
    {
        openCoefficient: {
            [EyeSide.RIGHT]: eyelidPosition.CLOSED,
            [EyeSide.LEFT]: eyelidPosition.OPEN,
        },
        duration: 500,
    },
    wink,
];

const constricted = {
    dilation: pupilSizes.constricted,
    openCoefficient: eyelidPosition.SHOCKED,
    duration: 100,
};

const dilated = {
    dilation: pupilSizes.dilated,
    openCoefficient: eyelidPosition.SQUINT,
    duration: 100,
};

export const shock: Animation = [
    {
        dilation: pupilSizes.dilated,
        openCoefficient: eyelidPosition.SQUINT,
        duration: 500,
    },
    constricted,
    dilated,
    constricted,
    dilated,
];

export const animationMapping: {
    [key: string]: (() => Animation) | Animation;
} = {
    [Pose.LEFT_WAVE]: rightWink,
    [Pose.RIGHT_WAVE]: leftWink,
    [Pose.HANDS_UP]: rollEyes,
    [Pose.ARMS_OUT]: shock,
    [Pose.DAB]: dab,
};

export function rollEyes(): Animation {
    const path = [];

    const radius = 0.3;
    const totalPoints = 16;
    for (let i = 0; i <= totalPoints; i++) {
        const change = (Math.PI * 2) / totalPoints;
        const theta = change * i;

        const y = radius * Math.sin(theta);
        const x = radius * Math.cos(theta);

        path.push({ target: { x, y }, duration: 100 });
    }

    return path;
}

export function dab(): Animation {
    const animation = [];
    for (let i = 0; i < 20; i++) {
        animation.push({
            target: {
                x: normalise(Math.random(), 1),
                y: normalise(Math.random(), 1),
            },
            irisColor: '#' + (((1 << 24) * Math.random()) | 0).toString(16),
            duration: 150,
            openCoefficient:
                eyelidPosition.OPEN + (eyelidPosition.OPEN * i) / 20,
        });
    }
    return animation;
}

export function naturalMovement(isLeft: boolean): Animation {
    const xDistance = normalise(
        Math.random(),
        1,
        0,
        1 - idleMovementConsts.sideBuffer,
        0,
    );
    const x = isLeft ? -xDistance : xDistance;
    return [
        {
            target: { x, y: 0 },
            duration: 500,
        },
        {
            target: { x, y: 0 },
            duration: normalise(Math.random(), 1, 0, 2000, 0),
        },
        {
            target: { x: 0, y: 0 },
            duration: 500,
        },
    ];
}

export function blink(): Animation {
    return [
        {
            openCoefficient: eyelidPosition.CLOSED,
            duration: transitionTimes.blink,
        },
        {
            openCoefficient: eyelidPosition.OPEN,
            duration: transitionTimes.blink,
        },
    ];
}
