import { Detection } from '../../models/objectDetection';
import calculateTargetPos from '../objectTracking/calculateFocus';
import { Bbox, ICoords } from '../types';
import { isPerson } from './detectionSelector';

export default function select(
    detections: Detection[],
    compare: (x: Bbox, y: Bbox) => number,
    filter?: (d: Detection) => boolean,
): Bbox | undefined {
    const personBboxes: Bbox[] = detections
        .filter(
            detection => isPerson(detection) && (!filter || filter(detection)),
        )
        .map(detection => detection.bbox);

    return personBboxes.reduce<Bbox | undefined>(
        (best, current) =>
            best === undefined || compare(current, best) > 0 ? current : best,
        undefined,
    );
}

export function calculateColourMatch(
    imageData: ImageData,
    coords: ICoords,
): { r: number; g: number; b: number } {
    if (imageData) {
        const xStart =
            Math.round((coords.x + imageData.width / 2) / imageData.width) - 3;
        const yStart =
            Math.round((coords.y + imageData.height / 2) / imageData.height) -
            3;
        return getAvgColour(xStart, yStart, imageData);
    }
    return { r: 0, g: 0, b: 0 };
}

function getAvgColour(
    xStart: number,
    yStart: number,
    imageData: ImageData,
): { r: number; g: number; b: number } {
    let r = 0;
    let g = 0;
    let b = 0;
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
            }
        }
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
    avgColour: { r: number; g: number; b: number },
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
