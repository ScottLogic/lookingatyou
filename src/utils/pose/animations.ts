import { eyelidPosition, EyeSide, Pose } from '../../AppConstants';
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
    [Pose.WAVE]: wink,
    [Pose.HANDS_UP]: rollEyes,
    [Pose.DAB]: dab,
};

export function wink(): Animation {
    return [
        {
            openCoefficient: {
                [EyeSide.LEFT]: eyelidPosition.CLOSED,
                [EyeSide.RIGHT]: eyelidPosition.OPEN,
            },
            duration: 500,
        },
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

export function dab(): Animation {
    const animation = [];
    for (let i = 0; i < 20; i++) {
        animation.push({
            irisColour: '#' + (((1 << 24) * Math.random()) | 0).toString(16),
            duration: 150,
            openCoefficient:
                eyelidPosition.OPEN + (eyelidPosition.OPEN * i) / 20,
        });
    }
    return animation;
}
