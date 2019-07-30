import {
    dab,
    leftWink,
    rightWink,
    rollEyes,
    shock,
} from '../../utils/pose/animations';

describe('animations should have set number of frames', () => {
    it('rightWink should have 2 frames', () =>
        expect(rightWink().length).toEqual(2));
    it('leftWink should have 2 frames', () =>
        expect(leftWink().length).toEqual(2));
    it('eyeRoll should have 17 frames', () =>
        expect(rollEyes().length).toEqual(17));
    it('shock should have 5 frames', () => expect(shock().length).toEqual(5));
    it('dab should have 20 frames', () => expect(dab().length).toEqual(20));
});
