import { getImageData } from '../../../__test_utils__/getImageData';
import { analyseLight } from '../../../components/eye/utils/MovementUtils';

describe('analyseLight', () => {
    const imageData = getImageData(10, 10);
    const tooBright = true;

    it('should return false and 0 for empty image', () => {
        const expectedValue = {
            tooBright: false,
            scaledPupilSize: 0,
        };
        expect(analyseLight(getImageData(0, 0), false)).toStrictEqual(
            expectedValue,
        );
    });
    it('should not be too bright', () => {
        const expectedValue = {
            tooBright: false,
            scaledPupilSize: 1.1436363636363636,
        };
        expect(analyseLight(imageData, tooBright)).toStrictEqual(expectedValue);
    });
});
