import { getBbox, getImageDataFromVideo } from '../../utils/utils';
import { defaultDetection } from './select/select.test';

describe('getBBox should give bbox or undefined', () => {
    it('should be bbox', () => {
        expect(getBbox(defaultDetection)).toStrictEqual([0, 1, 1, 1]);
    });
    it('should be undefined', () => {
        expect(getBbox(undefined)).toBe(undefined);
    });
});

describe('getImageData should work even on undefined input', () => {
    it('should be empty', () => {
        expect(getImageDataFromVideo(undefined, document)).toBe(null);
    });
});
