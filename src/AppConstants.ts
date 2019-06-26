import IUserConfig from './components/configMenu/InterfaceUserConfig';

export const FPS = 2;
export const eyes = {
    LEFT: 'left',
    RIGHT: 'right',
};
export const colours = {
    scleraColor: 'white',
    irisColor: '#ff8080', // must be hex value, as this is passed to colour picker input
    pupilColor: 'black',
};
export const defaultConfigValues: IUserConfig = {
    xSensitivity: 1,
    ySensitivity: 1,
    fps: 5,
    swapEyes: false,
    toggleDebug: false,
    irisColor: colours.irisColor,
};
export const configStorageKey = 'config';
export const eyelidPosition = {
    OPEN: 0.5,
    CLOSED: 0,
    SHOCKED: 0.75,
};
export const pupilSizes = {
    dilated: 1.3,
    neutral: 1.0,
    constricted: 0.8,
};
export const blinkFrequency = 0.25;
export const pupilSizeChangeInterval = 2500;
export const transitionTime = 100; // for animating eyelids and pupils
