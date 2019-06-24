import IUserConfig from './components/ConfigMenu/IUserConfig';

export const videoinput = 'videoinput';
export const FPS = 30;
export const eyes = {
    LEFT: 'left',
    RIGHT: 'right',
}
export const colours = {
    scleraColor: "white",
    irisColor: "#ff8080", // must be hex value, as this is passed to colour picker input
    pupilColor: "black"
}
export const defaultConfigValues: IUserConfig = {
    xSensitivity: 1,
    ySensitivity: 1,
    fps: 5,
    swapEyes: false,
    toggleDebug: false,
    irisColor: colours.irisColor,
}
export const configStorageKey = "config";