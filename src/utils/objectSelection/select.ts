import { Detection } from '../../models/objectDetection';
import calculateTargetPos from '../objectTracking/calculateFocus';
import { Bbox, ICoords } from '../types';
import { isPerson } from './detectionSelector';

let avgColour = { r: 0, g: 0, b: 0 };

export default function select(
    detections: Detection[],
    coords: ICoords,
    imageData: ImageData,
    compare: (x: Bbox, y: Bbox) => number,
    filter?: (d: Detection) => boolean,
): Bbox | undefined {
    const personBboxes: Bbox[] = detections
        .filter(
            detection => isPerson(detection) && (!filter || filter(detection)),
        )
        .map(detection => detection.bbox);

    if (imageData) {
        const xStart =
            Math.round((coords.x + imageData.width / 2) / imageData.width) - 3;
        const yStart =
            Math.round((coords.y + imageData.height / 2) / imageData.height) -
            3;

        avgColour = getAvgColour(xStart, yStart, imageData);
    }
    console.log(
        '%c CHOSENCOLOUR',
        'background-color: #' +
            Math.round(avgColour.r) +
            Math.round(avgColour.g) +
            Math.round(avgColour.b),
    );
    return personBboxes.reduce<Bbox | undefined>(
        (best, current) =>
            best === undefined || compare(current, best) > 0 ? current : best,
        undefined,
    );
}

function getAvgColour(xStart: number, yStart: number, imageData: ImageData) {
    let r = 0;
    let g = 0;
    let b = 0;
    let counter = 0;
    if (imageData) {
        for (let i = xStart; i < xStart + 6 * 4; i += 4) {
            for (
                let j = yStart;
                j < yStart + 6 * 4 * imageData.width;
                j += imageData.width * 4
            ) {
                r = imageData.data[i + j];
                g = imageData.data[i + j + 1];
                b = imageData.data[i + j + 2];
                counter += 1;
            }
        }
        console.log(counter);
        r = r / 36;
        g = g / 36;
        b = b / 36;
    }
    return { r, g, b };
}

export function leftOf(x: number) {
    return (detection: Detection) => {
        return detection.bbox[0] < x;
    };
}

export function rightOf(x: number) {
    return (detection: Detection) => {
        return detection.bbox[0] > x;
    };
}

export function largerThan(bbox1: Bbox, bbox2: Bbox): number {
    return bbox1[2] * bbox1[3] - bbox2[2] * bbox2[3];
}

export function closerToColour(
    imageData: ImageData,
): (bbox1: Bbox, bbox2: Bbox) => number {
    return function closerToCoords(bbox1: Bbox, bbox2: Bbox) {
        const bbox1AvgColour = getAvgColour(bbox1[0], bbox1[1], imageData);
        const bbox2AvgColour = getAvgColour(bbox2[0], bbox2[1], imageData);

        const bbox1gDiff = Math.pow(bbox1AvgColour.g - avgColour.g, 2);
        const bbox1bDiff = Math.pow(bbox1AvgColour.b - avgColour.b, 2);
        const bbox1rDiff = Math.pow(bbox1AvgColour.r - avgColour.r, 2);
        const bbox2rDiff = Math.pow(bbox2AvgColour.r - avgColour.r, 2);
        const bbox2gDiff = Math.pow(bbox2AvgColour.g - avgColour.g, 2);
        const bbox2bDiff = Math.pow(bbox2AvgColour.b - avgColour.b, 2);

        const bbox1Diff = bbox1rDiff + bbox1gDiff + bbox1bDiff;
        const bbox2Diff = bbox2rDiff + bbox2gDiff + bbox2bDiff;

        return bbox1Diff < bbox2Diff ? 1 : -1;
    };
}

export function closerTo(
    coords: ICoords,
): (bbox1: Bbox, bbox2: Bbox) => number {
    return function closerToCoords(bbox1: Bbox, bbox2: Bbox) {
        return (
            Math.hypot(bbox2[0] - coords.x, bbox2[1] - coords.y) -
            Math.hypot(bbox1[0] - coords.x, bbox1[1] - coords.y)
        );
    };
}

export function closerVerticallyTo(
    y: number,
): (bbox1: Bbox, bbox2: Bbox) => number {
    return function closerToCoords(bbox1: Bbox, bbox2: Bbox) {
        return (
            Math.abs(calculateTargetPos(bbox2).y - y) -
            Math.abs(calculateTargetPos(bbox1).y - y)
        );
    };
}

export function first(bbox1: Bbox, bbox2: Bbox): number {
    return 0;
}
