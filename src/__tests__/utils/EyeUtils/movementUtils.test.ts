import { getImageData } from '../../../__test_utils__/getImageData';
import { analyseLight } from '../../../components/eye/utils/MovementUtils';

describe('analyseLight', () => {
    const imageData = getImageData(10, 10);

    it('should return false and NaN for empty image', () => {
        const expectedValue = {
            tooBright: false,
            scaledPupilSize: NaN,
        };
        expect(analyseLight(getImageData(0, 0))).toStrictEqual(expectedValue);
    });
    it('should not be too bright', () => {
        const expectedValue = {
            tooBright: false,
            scaledPupilSize: 1.3654545454545453,
        };
        expect(analyseLight(imageData)).toStrictEqual(expectedValue);
    });
});
