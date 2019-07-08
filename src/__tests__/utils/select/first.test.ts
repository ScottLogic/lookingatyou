import {
    DetectionModelType,
    ICocoSSDDetection,
    IDetection,
} from '../../models/objectDetection';
import select, { first } from '../../utils/objectSelection/select';

const notPerson: ICocoSSDDetection = {
    model: DetectionModelType.CocoSSD,
    bbox: [0, 0, 0, 0],
    info: {
        certainty: 100,
        type: 'giraffe',
    },
};

const person: ICocoSSDDetection = {
    model: DetectionModelType.CocoSSD,
    bbox: [1, 1, 1, 1],
    info: {
        certainty: 50,
        type: 'person',
    },
};

describe('selectFirstOfType should return', () => {
    const selectFirst = (detections: IDetection[]) => select(detections, first);

    it('undefined when arg:detections is empty', () => {
        expect(selectFirst([])).toBeUndefined();
    });
    it('undefined when arg:detections does not contain detection of arg:type', () => {
        expect(selectFirst([notPerson]));
    });
    it('Bbox of detection if arg:detections contains a detection of arg:type', () => {
        expect(selectFirst([person])).toBe(person.bbox);
        expect(
            selectFirst([
                { ...notPerson },
                { ...person },
                {
                    ...notPerson,
                    info: { certainty: 20, type: 'chair' },
                },
            ]),
        ).toBe(person.bbox);
    });
    it('Bbox of first detection if arg:detections contains multiple detections of arg:type', () => {
        expect(
            selectFirst([
                { ...person },
                { ...person, bbox: [2, 2, 2, 2] },
                { ...person, bbox: [3, 3, 3, 3] },
            ]),
        ).toBe(person.bbox);
    });
});
