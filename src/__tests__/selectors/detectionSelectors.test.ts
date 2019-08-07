import { getImageData } from '../../__test_utils__/getImageData';
import { makeDetection } from '../../__test_utils__/makeDetection';
import { bodyParts, centerPoint } from '../../AppConstants';
import { IDetection } from '../../models/objectDetection';
import {
    getColorCombiner,
    getSelectionsCombiner,
    getTargetsCombiner,
} from '../../store/selectors/detectionSelectors';

describe('getSelectionCombiner', () => {
    it('should return undefined when there are no detections', () => {
        expect(
            getSelectionsCombiner([], [], [], getImageData(0, 0)),
        ).toBeUndefined();
    });
    it('should return that selection when there is only one selection', () => {
        const detection = makeDetection(10, 10);
        expect(
            getSelectionsCombiner([detection], [], [], getImageData(0, 0)),
        ).toStrictEqual(detection);
    });
    it('should return the selection closest to the item in history when history is a singleton', () => {
        const detections = [makeDetection(0, 0), makeDetection(9, 0)];
        const previousTargets = [{ x: -0.9, y: -1 }];
        const previousColours = [{ r: 0, g: 0, b: 0 }];
        expect(
            getSelectionsCombiner(
                detections,
                previousTargets,
                previousColours,
                getImageData(10, 10),
            ),
        ).toStrictEqual(detections[0]);
    });
});
describe('getTargetsCombiner', () => {
    it('should return the idle targets when selection and/or video is undefined', () => {
        expect(getTargetsCombiner(undefined, undefined)).toStrictEqual(
            centerPoint,
        );
    });
    it('should return the selection normalised to between -1 and 1, when selection and video are both defined', () => {
        const selection = makeDetection(150, 250);
        const dimensions = { width: 300, height: 250 };
        expect(getTargetsCombiner(selection, dimensions)).toStrictEqual({
            x: 0,
            y: 1,
        });
    });
});
describe('getColourCombiner', () => {
    it('should return 0 for all rgb values when selection is undefined', () => {
        expect(getColorCombiner(undefined, getImageData(1, 1))).toStrictEqual({
            r: 0,
            b: 0,
            g: 0,
        });
    });
    it('should correctly return color based on keypoints of the selection and color values stored in imageData', () => {
        const selection: IDetection = {
            bbox: [10, 10, 0, 0],
            info: {
                score: 100,
                keypoints: [
                    {
                        score: 1,
                        position: { x: 15, y: 15 },
                        part: bodyParts.LEFT_SHOULDER,
                    },
                    {
                        score: 1,
                        position: { x: 45, y: 15 },
                        part: bodyParts.LEFT_SHOULDER,
                    },
                ],
            },
        };
        const imageData = getImageData(400, 400);
        expect(getColorCombiner(selection, imageData)).toStrictEqual({
            r: 189,
            g: 0,
            b: 208,
        }); // values adjusted slightly for color-space conversion
    });
});
