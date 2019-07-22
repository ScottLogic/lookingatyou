export enum EyeSide {
    RIGHT = 'RIGHT',
    LEFT = 'LEFT',
}
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
    dilate: 750,
};
export const neutralBlinkFrequency = 0.25;
export const irisSkewFactor = 0.8;
export const maxMoveWithoutBlink = 0.8;
export const chosenTargetColour = 'green';
export const nonChosenTargetColour = 'red';
export const maxNumTargetsToConsider = 5;
export const bodyParts = {
    RIGHT_SHOULDER: 'rightShoulder',
    LEFT_SHOULDER: 'leftShoulder',
    RIGHT_HIP: 'rightHip',
};
