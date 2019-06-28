import { IDetection } from '../interfaces';
import selectFirstOfType from './selectFirst';

const notPerson: IDetection = {
    bbox: [0, 0, 0, 0],
    info: {
        certainty: 100,
        type: 'giraffe',
    },
};

const person: IDetection = {
    bbox: [1, 1, 1, 1],
    info: {
        certainty: 50,
        type: 'person',
    },
};

describe('selectFirstOfType should return', () => {
    it('undefined when arg:detections is empty', () => {
        expect(selectFirstOfType([])).toBeUndefined();
    });
    it('undefined when arg:detections does not contain detection of arg:type', () => {
        expect(selectFirstOfType([notPerson]));
    });
    it('Bbox of detection if arg:detections contains an detection of arg:type', () => {
        expect(selectFirstOfType([person])).toBe(person.bbox);
        expect(
            selectFirstOfType([
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
            selectFirstOfType([
                { ...person },
                { ...person, bbox: [2, 2, 2, 2] },
                { ...person, bbox: [3, 3, 3, 3] },
            ]),
        ).toBe(person.bbox);
    });
});
