import { hasKeysOf } from '../store/store';
describe('hasPropsOf', () => {
    it('should return true when objToMatch is empty object', () => {
        const objToCheck = { test: 'test', num: 5 };
        expect(hasKeysOf(objToCheck, {})).toBeTruthy();
    });
    const objToMatch = { a: 4, c: false };
    it('should return true when objToCheck has all keys of objToMatch', () => {
        const objToCheck = { a: 5, b: 'wee', c: false };
        expect(hasKeysOf(objToCheck, objToMatch)).toBeTruthy();
    });
    it('should return false when objToMatch has some key that objToCheck does not have', () => {
        const objToCheck = { a: 6, b: 'test', d: true };
        expect(hasKeysOf(objToCheck, objToMatch)).toBeFalsy();
    });
    const complexObjToMatch = {
        obj1: {
            x: 5,
            y: 6,
        },
        obj2: {
            z: 6021830,
        },
        x: 'test',
        y: 'haha',
    };
    it('should return true when objToKeys has all keys of objToMatch, and all object children of objToKeys have all keys of that same child of objToMatch', () => {
        const objToCheck = {
            obj1: {
                x: 5,
                y: 6,
                z: 'test',
            },
            obj2: { z: 'test' },
            x: 'test',
            y: false,
            w: false,
        };
        expect(hasKeysOf(objToCheck, complexObjToMatch)).toBeTruthy();
    });
    it('should return false when some child of objToMatch has a key which does not belong to that same child of objToCheck', () => {
        const objToCheck = {
            obj1: {
                x: 5,
                b: 6,
                z: 'test',
            },
            obj2: { z: 'test' },
            x: 'test',
            y: false,
            w: false,
        };
        expect(hasKeysOf(objToCheck, complexObjToMatch)).toBeFalsy();
    });
});
