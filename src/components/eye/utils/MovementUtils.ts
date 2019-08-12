import { lightConsts } from '../../../AppConstants';
import { ICoords } from '../../../utils/types';

export function analyseLight(image: ImageData): number {
    if (!image) {
        return 0;
    }

    const data = image.data;

    let colorSum = 0;
    for (let i = 0; i < data.length; i += 4) {
        colorSum += data[i] + data[i + 1] + data[i + 2];
    }

    const brightness = Math.floor(colorSum / (image.width * image.height * 3));
    return Math.min(brightness, lightConsts.maxBrightness);
}

export function confineToCircle(target: ICoords, radius: number = 1) {
    const hypotenuse = Math.hypot(target.x, target.y);
    const scale = hypotenuse > radius ? radius / hypotenuse : 1;

    return { x: scale * target.x, y: scale * target.y };
}
