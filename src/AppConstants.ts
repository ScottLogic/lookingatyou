export enum EyeSide {
    RIGHT = 'RIGHT',
    LEFT = 'LEFT',
}
export enum Pose {
    WAVE = 'WAVE',
    HANDS_UP = 'HANDS_UP',
}
export const eyeRatio = {
    sclera: 4.5,
    iris: 10,
    pupil: 24,
};

export const eyelidPosition = {
    OPEN: 0.45,
    CLOSED: 0,
    SQUINT: 0.2,
    SHOCKED: 0.75,
};
export const pupilSizes = {
    dilated: 1.3,
    neutral: 1.0,
    constricted: 0.8,
};
export const pupilSizeChangeInterval = 2500;
export const middleX = 0;
export const middleY = 0;
export const xIncrement = 1;
export const moveSize = 0.4;
export const buffer = 0.2;
export const maxBrightness = 220;
export const dilationMultipler = 0.8;
export const dilationOffset = 0.7;
export const sleepDelay = 25000;
export const transitionTime = {
    blink: 200,
};
export const neutralBlinkFrequency = 0.25;
export const irisSkewFactor = 0.8;
export const maxMoveWithoutBlink = 0.8;
export const chosenTargetColour = 'green';
export const nonChosenTargetColour = 'red';
export const maxNumTargetsToConsider = 8;
export const bodyParts = {
    RIGHT_SHOULDER: 'rightShoulder',
    LEFT_SHOULDER: 'leftShoulder',
    RIGHT_HIP: 'rightHip',
};
export const canvasScale = 1;
export const canvasLineWidth = 5;
export const minConfidence = 0.2;
export const yOffset = 10;
export const xOffset = 10;
export const minTargetInterval = 4000;
export const maxTargetInterval = 7000;
export const fisheyeConsts = {
    intensity: 0.6,
};
