import { areElementsNotUndefined, areNotEqual } from '../../utils/arrayUtils';

describe('undefined elements test', () => {
    const videos: Array<HTMLVideoElement | undefined> = [
        undefined,
        undefined,
        undefined,
    ];
    it('should be false', () => {
        expect(areElementsNotUndefined(videos)).toBeFalsy();
    });
    it('should be true', () => {
        expect(areElementsNotUndefined([])).toBeTruthy();
    });
});

describe('array equality test', () => {
    const videos1: Array<HTMLVideoElement | undefined> = [
        undefined,
        undefined,
        undefined,
    ];
    const videos2: Array<HTMLVideoElement | undefined> = [undefined, undefined];
    it('should be true', () => {
        expect(areNotEqual(videos1, videos2)).toBeTruthy();
        expect(areNotEqual(videos1, [])).toBeTruthy();
        expect(areNotEqual([], videos2)).toBeTruthy();
    });
    it('should be false', () => {
        expect(areNotEqual([], [])).toBeFalsy();
        expect(areNotEqual(videos1, videos1)).toBeFalsy();
        expect(areNotEqual(videos2, videos2)).toBeFalsy();
    });
});
