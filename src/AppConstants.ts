export enum EyeSide {
    RIGHT = 'RIGHT',
    LEFT = 'LEFT',
}
export enum Pose {
    LEFT_WAVE = 'LEFT_WAVE',
    RIGHT_WAVE = 'RIGHT_WAVE',
    HANDS_UP = 'HANDS_UP',
    ARMS_OUT = 'ARMS_OUT',
    DAB = 'DAB',
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
    neutral: 1.0, // base dilation
    constricted: 0.8,
};
export const transitionTimes = {
    blink: 100,
};
export const intervals = {
    sleep: 25000, // eyes go to sleep after this much time without targets
};
export const debugFeedColors = {
    chosen: 'green', // chosen target drawn to debug feed in this colour
    other: 'red', // other targets drawn in this colour
};
export const eyeCoords = {
    middleX: 0, // middle of unit coordinate grid used for eye position
    middleY: 0,
};
export const idleMovementConsts = {
    moveCenterChance: 0.1,
    moveSideChance: 0.5,
    xDelta: 0.4, // move this distance between frames when scanning the room
    sideBuffer: 0.2, // do not move the iris closer than this distance to the edge of the sclera
};
export const lightConsts = {
    maxBrightness: 220, // brightness dilation multiplier at max when average brightness reaches this value
    dilationMultipler: 1.2, // max brightness dilation multiplier = offset + multiplier
    dilationOffset: 0.7, // min brightness dilation multiplier
};
export const blinkConsts = {
    frequency: 0.25,
    focusedFrequency: 0.0625,
    movementThreshold: 0.8, // eye blinks when, between frames, it mvoes this distance
};
export const debugFeedConsts = {
    canvasScale: 1,
    lineWidth: 4,
    minConfidence: 0.1,
    pointRadius: 3,
};
export const colorCheckConsts = {
    yOffset: 10,
    xOffset: 10,
};
export const bodyParts = {
    RIGHT_SHOULDER: 'rightShoulder',
    LEFT_SHOULDER: 'leftShoulder',
    RIGHT_HIP: 'rightHip',
};
export const fisheyeConsts = {
    intensity: 0.6,
};
export const targetingConsts = {
    minInterval: 4000,
    maxInterval: 7000,
    maxNum: 8,
};

export const configMenuConsts = {
    visibleTimer: 1000,
    width: '17.5em',
};

export const userInteraction = {
    texts: [
        'HELLO',
        'TRY WAVING',
        "I DON'T HAVE HANDS",
        'PLAY WITH ME',
        "DON'T LEAVE ME",
        'NOTHING TO SEE HERE',
    ],
    delay: 30000,
    textDuration: 3000,
};
export const fadeInText = {
    threshold: 0.2,
    delayMin: 200,
    delayMax: 1000,
    transitionMax: 2000,
    transitionMin: 200,
};
export const numInnerEyeSectors = 100;
export const minPoseConfidence = 0.2;
export const minIrisScale = 0.8; // factor by which to squish iris when iris is all the way to edge of sclera
export const CIELabOffset = 128;
