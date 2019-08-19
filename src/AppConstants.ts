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
    peek: 1000,
};
export const intervals = {
    sleep: 18000, // eyes go to sleep after this much time without targets
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
    peekFrequency: 0.0475, // frequency with which the eye peeks when eyes are closed
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
export const eyeCoefficients = {
    // multiple screen width by these values to get size of eye parts
    sclera: 1 / 4.5,
    iris: 1 / 10,
    pupil: 1 / 24,
};
export const configMenuConsts = {
    visibleTimer: 1000,
    width: '17.5em',
    leftPos: 'calc(-17.5em - 10px)',
};

export const userInteraction = {
    texts: [
        { phrase: 'HELLO', frequency: 1 },
        { phrase: 'TRY WAVING', frequency: 1 },
        { phrase: "I DON'T HAVE HANDS", frequency: 0.5 },
        { phrase: 'PLAY WITH ME', frequency: 0.7 },
        { phrase: "DON'T LEAVE ME", frequency: 0.5 },
        { phrase: 'NOTHING TO SEE HERE', frequency: 0.6 },
        { phrase: 'I HAVE NO MOUTH AND I MUST SCREAM', frequency: 0.03 },
    ],
    delay: 30000,
    textDuration: 3000,
};
export const fadeInText = {
    threshold: 0.2,
    delayMin: 200,
    delayMax: 1000,
    fontSize: '5em',
    defaultTextLength: 20,
};
export const numInnerEyeSectors = 100;
export const minPoseConfidence = 0.2;
export const minIrisScale = 0.8; // factor by which to squish iris when iris is all the way to edge of sclera
export const CIELabOffset = 128;
export const centerPoint = { x: 0, y: 0 };
export const chanceOfIdleEyesMovement = 0.2;
export const animationCooldownTimeout = 5000;
