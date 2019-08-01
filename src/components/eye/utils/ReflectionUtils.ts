import { fisheyeConsts } from '../../../AppConstants';
import { normalise } from '../../../utils/objectTracking/calculateFocus';
import { ICoords } from '../../../utils/types';

export function getReflection(
    radius: number,
    selection: ICoords,
    image: HTMLVideoElement,
) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return new ImageData(image.width, image.height);
    }
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    const crop = getCrop(selection, image);
    ctx.scale(-1, 1);
    ctx.filter = 'blur(1px)';
    const diameter = radius * 2;
    ctx.drawImage(
        image,
        crop.sourceX,
        crop.sourceX,
        crop.sourceWidth,
        crop.sourceHeight,
        0,
        0,
        -diameter,
        diameter,
    );
    const imgData = ctx.getImageData(0, 0, diameter, diameter);
    const result: Uint8ClampedArray = fisheye(imgData.data, diameter, diameter);
    imgData.data.set(result);
    return imgData;
}

function fisheye(
    pixels: Uint8ClampedArray,
    width: number,
    height: number,
): Uint8ClampedArray {
    const result = new Uint8ClampedArray(pixels.length);

    for (let currRow = 0; currRow < height; currRow++) {
        const normalisedY = (2 * currRow) / height - 1; // a
        const normalYSquared = normalisedY * normalisedY; // a^2

        for (let currColumn = 0; currColumn < width; currColumn++) {
            const normalisedX = (2 * currColumn) / width - 1; // b
            const normalXSquared = normalisedX * normalisedX; // b^2

            const normalisedRadius = Math.sqrt(normalXSquared + normalYSquared); // c=sqrt(a^2 + b^2)

            // For any point in the circle
            if (0.0 <= normalisedRadius && normalisedRadius <= 1.0) {
                // The closer to the center it is, the larger the value
                let radiusScaling = Math.sqrt(
                    1.0 - normalisedRadius * normalisedRadius,
                );
                radiusScaling =
                    (normalisedRadius + (1.0 - radiusScaling)) / 2.0;
                // Exponential curve between 0 and 1, ie pixels closer to the center have a much lower scaling value

                radiusScaling =
                    radiusScaling * fisheyeConsts.intensity +
                    normalisedRadius * (1 - fisheyeConsts.intensity);

                const theta = Math.atan2(normalisedY, normalisedX); // angle to point from center of circle
                const scaledNormalisedX = radiusScaling * Math.cos(theta);
                const scaledNormalisedY = radiusScaling * Math.sin(theta);
                const newX = Math.floor(((scaledNormalisedX + 1) * width) / 2); // normalise x to size of circle
                const newY = Math.floor(((scaledNormalisedY + 1) * height) / 2); // normalise y to size of circle
                const srcpos = newY * width + newX; // New pixel position in array
                if (srcpos >= 0 && srcpos < width * height) {
                    for (let i = 0; i < 4; i++) {
                        result[
                            4 * Math.floor(currRow * width + currColumn) + i
                        ] = pixels[srcpos * 4 + i];
                    }
                }
            }
        }
    }
    return result;
}

function getCrop(target: ICoords, image: HTMLVideoElement) {
    const boxSize = image.width * 0.4;

    let sourceX = normalise(target.x, 1, -1, image.width, 0) - boxSize / 2;
    sourceX = Math.min(sourceX, image.width - boxSize);
    sourceX = Math.max(sourceX, 0);

    let sourceY = normalise(target.y, 1, -1, image.height, 0) - boxSize / 2;
    sourceY = Math.min(sourceY, image.height - boxSize);
    sourceY = Math.max(sourceY, 0);

    return {
        sourceX,
        sourceY,
        sourceWidth: boxSize,
        sourceHeight: boxSize,
    };
}
