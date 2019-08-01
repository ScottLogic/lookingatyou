import { dab, rollEyes } from '../../utils/pose/animations';

describe('animations should have set number of frames', () => {
    const roll = rollEyes();
    const dabbing = dab();

    it('eyeRoll should have 17 frames', () => {
        expect(roll.length).toEqual(17);
        expect(Array.isArray(roll)).toBeTruthy();
    });
    it('dab should have 20 frames', () => {
        expect(dabbing.length).toEqual(20);
        expect(Array.isArray(dabbing)).toBeTruthy();
    });
});
