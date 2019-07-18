import { DetectionModelType } from '../../models/objectDetection';

export default interface IUserConfig {
    model: DetectionModelType;
    xSensitivity: number;
    ySensitivity: number;
    fps: number;
    swapEyes: boolean;
    toggleDebug: boolean;
    irisColor: string;
}
