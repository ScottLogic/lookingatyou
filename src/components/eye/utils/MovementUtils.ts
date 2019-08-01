import convert from 'color-convert';
import { CIELabOffset, lightConsts } from '../../../AppConstants';
import { normalise } from '../../../utils/objectTracking/calculateFocus';

export function analyseLight(
    image: ImageData,
): { tooBright: boolean; scaledPupilSize: number } {
    if (!image) {
        return { tooBright: false, scaledPupilSize: 0 };
    }

    const data = image.data;

    let colorSum = 0;
    for (let i = 0; i < data.length; i += 4) {
        const pixelL = convert.rgb.lab([data[i], data[i + 1], data[i + 2]])[0];
        colorSum += pixelL;
    }

    let brightness =
        Math.floor(colorSum / (image.width * image.height)) + CIELabOffset;
    brightness = Math.min(brightness, lightConsts.maxBrightness);

    const scaledPupilSize = normalise(
        lightConsts.maxBrightness - brightness,
        lightConsts.maxBrightness,
        0,
        lightConsts.dilationMultipler + lightConsts.dilationOffset,
        lightConsts.dilationOffset,
    );

    return {
        tooBright: lightConsts.maxBrightness === brightness,
        scaledPupilSize,
    };
}
