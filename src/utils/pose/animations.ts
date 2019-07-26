import { eyelidPosition, EyeSide, Pose, pupilSizes } from '../../AppConstants';
import { ICoords } from '../types';

interface IAnimationFrame {
    coords?: ICoords;
    openCoefficient?:
        | number
        | { [EyeSide.LEFT]: number; [EyeSide.RIGHT]: number };
    dilation?: number;
    irisColour?: string;
    duration: number;
}

export type Animation = IAnimationFrame[];

export const animationMapping: { [key: string]: () => Animation } = {
    [Pose.LEFT_WAVE]: leftWink,
    [Pose.RIGHT_WAVE]: rightWink,
    [Pose.HANDS_UP]: rollEyes,
    [Pose.ARMS_OUT]: shock,
};

export function leftWink(): Animation {
    const left = {
        openCoefficient: {
            [EyeSide.LEFT]: eyelidPosition.CLOSED,
            [EyeSide.RIGHT]: eyelidPosition.OPEN,
        },
        duration: 500,
    };
    return wink(left);
}

export function rightWink(): Animation {
    const right = {
        openCoefficient: {
            [EyeSide.RIGHT]: eyelidPosition.CLOSED,
            [EyeSide.LEFT]: eyelidPosition.OPEN,
        },
        duration: 500,
    };
    return wink(right);
}

function wink(animation: IAnimationFrame): Animation {
    return [
        animation,
        {
            openCoefficient: eyelidPosition.OPEN,
            duration: 500,
        },
    ];
}

export function rollEyes(): Animation {
    const path = [];

    const radius = 0.3;
    const totalPoints = 16;
    for (let i = 0; i <= totalPoints; i++) {
        const change = (Math.PI * 2) / totalPoints;
        const theta = change * i;

        const y = radius * Math.sin(theta);
        const x = radius * Math.cos(theta);

        path.push({ coords: { x, y }, duration: 100 });
    }

    return path;
}

export function shock(): Animation {
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

    return [
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
}
