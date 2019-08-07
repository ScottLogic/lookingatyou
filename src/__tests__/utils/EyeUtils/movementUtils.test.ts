import { getImageData } from '../../../__test_utils__/getImageData';
import { analyseLight } from '../../../components/eye/utils/MovementUtils';

describe('analyseLight', () => {
    const imageData = getImageData(10, 10);

    it('should return NaN for empty image', () => {
        const expectedValue = NaN;
        expect(analyseLight(getImageData(0, 0))).toStrictEqual(expectedValue);
    });
    it('should not be too bright', () => {
        const actual = analyseLight(imageData);
        expect(actual).toBeGreaterThan(1);
    });
});
