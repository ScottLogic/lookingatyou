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

export function confineToCircle(target: ICoords) {
    const radius = Math.min(1, Math.hypot(target.x, target.y));

    return radius === 0
        ? { x: 0, y: 0 }
        : { x: radius * (target.x / radius), y: radius * (target.y / radius) };
}
