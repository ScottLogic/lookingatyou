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

    const xStart =
        Math.round((coords.x + imageData.width / 2) / imageData.width) - 3;
    const yStart =
        Math.round((coords.y + imageData.height / 2) / imageData.height) - 3;

    avgColour = getAvgColour(xStart, yStart, imageData);

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
    for (let i = xStart; i < xStart + 6; i += 4) {
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
    const avgR = r / 36;
    const avgG = g / 36;
    const avgB = b / 36;
    return { r: avgR, g: avgG, b: avgB };
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

        const bbox1gDiff = Math.abs(bbox1AvgColour.g - avgColour.g);
        const bbox1bDiff = Math.abs(bbox1AvgColour.b - avgColour.b);
        const bbox1rDiff = Math.abs(bbox1AvgColour.r - avgColour.r);
        const bbox2rDiff = Math.abs(bbox1AvgColour.r - avgColour.r);
        const bbox2gDiff = Math.abs(bbox1AvgColour.g - avgColour.g);
        const bbox2bDiff = Math.abs(bbox1AvgColour.b - avgColour.b);

        const rAccuracy = bbox1rDiff >= bbox2rDiff ? 1 : -1;
        const gAccuracy = bbox1gDiff >= bbox2gDiff ? 1 : -1;
        const bAccuracy = bbox1bDiff >= bbox2bDiff ? 1 : -1;

        return rAccuracy + gAccuracy + bAccuracy;
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
