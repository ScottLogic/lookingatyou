import { eyelidPosition, Pose } from '../../AppConstants';
import { ICoords } from '../types';

interface IAnimationFrame {
    coords?: ICoords;
    openCoefficient?: number;
    dilation?: number;
    duration: number;
}

export type Animation = IAnimationFrame[];

export const animationMapping: { [key: string]: () => Animation } = {
    [Pose.WAVE]: rollEyes,
    [Pose.HANDS_UP]: doubleBlink,
};

export function doubleBlink(): Animation {
    return [
        {
            openCoefficient: eyelidPosition.CLOSED,
            duration: 200,
        },
        {
            openCoefficient: eyelidPosition.OPEN,
            duration: 200,
        },
        {
            openCoefficient: eyelidPosition.CLOSED,
            duration: 200,
        },
        {
            openCoefficient: eyelidPosition.OPEN,
            duration: 200,
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
