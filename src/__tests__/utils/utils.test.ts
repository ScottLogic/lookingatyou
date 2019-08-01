import {
    getBbox,
    getImageDataFromVideo,
    getLargerDistance,
} from '../../utils/utils';
import { defaultDetection } from './select/select.test';

describe('getBBox should give bbox or undefined', () => {
    it('should be bbox', () => {
        expect(getBbox(defaultDetection)).toStrictEqual([0, 1, 1, 1]);
    });
    it('should be undefined', () => {
        expect(getBbox(undefined)).toBe(undefined);
    });
});

describe('getLargerDistance should return the larger of the distances', () => {
    const old1 = { x: 0, y: 0 };
    const new1 = { x: 10, y: 0 };
    const old2 = { x: 10, y: -10 };
    const new2 = { x: -10, y: 50 };
    it('should work for all number cases', () => {
        expect(getLargerDistance(old1, new1)).toEqual(10);
        expect(getLargerDistance(old2, new2)).toEqual(60);
    });
});

describe('getImageData should work even on undefined input', () => {
    it('should be empty', () => {
        expect(getImageDataFromVideo(undefined, document)).toBe(null);
    });
});
