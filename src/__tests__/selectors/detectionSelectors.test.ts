import { getImageData } from '../../__test_utils__/getImageData';
import { makeDetection } from '../../__test_utils__/makeDetection';
import { getSelectionsCombiner } from '../../store/selectors/detectionSelectors';

describe('getSelectionCombiner', () => {
    it('should return undefined when there are no detections', () => {
        expect(
            getSelectionsCombiner([], [], [], getImageData(0, 0)),
        ).toBeUndefined();
    });
    it('should return that selection when there is only one selection', () => {
        const detection = makeDetection(10, 10);
        const detections = [detection];
        expect(
            getSelectionsCombiner(detections, [], [], getImageData(0, 0)),
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
