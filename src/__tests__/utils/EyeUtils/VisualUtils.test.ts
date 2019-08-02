import { minIrisScale } from '../../../AppConstants';
import {
    generateInnerPath,
    irisMatrixTransform,
} from '../../../components/eye/utils/VisualUtils';

describe('irisMatrixTransform', () => {
    it('should not transform the iris when it is centered', () => {
        const irisTransform = irisMatrixTransform({ x: 0, y: 0 });
        expect(irisTransform).toBe('');
    });
    it.each([[1], [-1]])(
        'should scale iris to the minimum with no skew when at eye is at cardinal position',
        position => {
            const testX = { xScale: minIrisScale, skew: 0, yScale: 1 };
            const testY = { xScale: 1, skew: 0, yScale: minIrisScale };
            let irisAdjustment = irisMatrixTransform({ x: position, y: 0 });
            expect(parseMatrixTransform(irisAdjustment)).toMatchObject(testX);
            irisAdjustment = irisMatrixTransform({ x: 0, y: position });
            expect(parseMatrixTransform(irisAdjustment)).toMatchObject(testY);
        },
    );
    it('should skew the iris correctly when at an angle', () => {
        const max = 1 / Math.sqrt(2);
        const irisAdjustment = irisMatrixTransform({ x: max, y: max });
        const { xScale, yScale, skew } = parseMatrixTransform(irisAdjustment);
        expect(xScale).toBeCloseTo(0.9);
        expect(yScale).toBeCloseTo(0.9);
        expect(skew).toBeCloseTo(0.1);
    });

    it.each([
        [-0.5, 0, 0.9, 1, 0],
        [-0.25, Math.sqrt(3) / -2, 0.986, 0.834, 0.048],
    ])(
        'should scale iris smoothly between center and outer radius',
        (x, y, scaleX, scaleY, expectedSkew) => {
            const irisAdjustment = irisMatrixTransform({
                x,
                y,
            });
            const { xScale, yScale, skew } = parseMatrixTransform(
                irisAdjustment,
            );
            expect(xScale).toBeCloseTo(scaleX);
            expect(yScale).toBeCloseTo(scaleY);
            expect(skew).toBeCloseTo(expectedSkew);
        },
    );
});

describe('generateInnerPath', () => {
    it('should return 4 sectored path of correct size', () => {
        const radius = 10;
        const numSectors = 4;
        const innerPath = generateInnerPath(radius, numSectors);
        expect(innerPath.trim()).toStrictEqual(
            'M -1.8369701987210297e-16 -1 L 6.3639610306789285 -6.363961030678928 L 1 0 L 6.3639610306789285 6.363961030678928 L 6.123233995736766e-17 1 L -6.363961030678928 6.3639610306789285 L -1 1.2246467991473532e-16 L -6.363961030678929 -6.363961030678928 L -1.8369701987210297e-16 -1',
        );
    });
});

function parseMatrixTransform(
    transform: string,
): { xScale: number; skew: number; yScale: number } {
    const stringValues = transform.slice(7).slice(0, -1);
    const values = stringValues.split(',').map(value => parseFloat(value));
    return { xScale: values[0], skew: values[1], yScale: values[3] };
}
