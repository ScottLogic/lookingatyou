import {
    dab,
    leftWink,
    rightWink,
    rollEyes,
    shock,
} from '../../utils/pose/animations';

describe('animations should have set number of frames', () => {
    const right = rightWink();
    const left = leftWink();
    const roll = rollEyes();
    const shocked = shock();
    const dabbing = dab();

    it('rightWink should have 2 frames', () => {
        expect(right.length).toEqual(2);
        expect(Array.isArray(right)).toBeTruthy();
    });
    it('leftWink should have 2 frames', () => {
        expect(left.length).toEqual(2);
        expect(Array.isArray(left)).toBeTruthy();
    });
    it('eyeRoll should have 17 frames', () => {
        expect(roll.length).toEqual(17);
        expect(Array.isArray(roll)).toBeTruthy();
    });
    it('shock should have 5 frames', () => {
        expect(shocked.length).toEqual(5);
        expect(Array.isArray(shocked)).toBeTruthy();
    });
    it('dab should have 20 frames', () => {
        expect(dabbing.length).toEqual(20);
        expect(Array.isArray(dabbing)).toBeTruthy();
    });
});
