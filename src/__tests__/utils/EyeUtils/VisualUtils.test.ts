import { irisSkewFactor } from '../../../AppConstants';
import {
    generateInnerPath,
    getIrisAdjustment,
    getMaxDisplacement,
} from '../../../components/eye/utils/VisualUtils';

describe('getIrisAdjustment', () => {
    it('should not scale iris when it is centered', () => {
        const x = 5;
        const y = 5;
        const height = 10;
        const width = 10;
        const scleraRadius = 30;
        const irisRadius = 20;
        const previousAngle = 0;
        const irisAdjustment = getIrisAdjustment(
            x,
            y,
            height,
            width,
            scleraRadius,
            irisRadius,
            previousAngle,
        );
        expect(irisAdjustment.scale).toBeCloseTo(1);
    });
    it('should scale iris to the minimum when at max displacement and should rotate to a multiple of 45 degees when eye is looking directly at corner', () => {
        const scleraRadius = 30;
        const irisRadius = 20;
        const height = 10;
        const width = 10;
        const x =
            width / 2 +
            getMaxDisplacement(scleraRadius, irisRadius) / Math.sqrt(2);
        const y =
            height / 2 -
            getMaxDisplacement(scleraRadius, irisRadius) / Math.sqrt(2);
        const previousAngle = 0;
        const irisAdjustment = getIrisAdjustment(
            x,
            y,
            height,
            width,
            scleraRadius,
            irisRadius,
            previousAngle,
        );
        expect(irisAdjustment.scale).toBe(irisSkewFactor);
        expect(irisAdjustment.angle % 45).toBeCloseTo(0, 1);
    });
    it('should never return an angle whose difference from the previous angle is less than or equal 90', () => {
        const height = 10;
        const width = 10;
        const scleraRadius = 30;
        const irisRadius = 20;
        let previousAngle = 0;
        const positions = [
            { x: 0, y: 0 },
            { x: 1, y: 3 },
            { x: 2, y: 2 },
            { x: 3, y: 1 },
            { x: 4, y: 5 },
            { x: 5, y: 4 },
            { x: 6, y: 6 },
            { x: 7, y: 8 },
            { x: 8, y: 9 },
            { x: 9, y: 7 },
        ];
        positions.forEach(({ x, y }) => {
            const irisAdjustment = getIrisAdjustment(
                x,
                y,
                height,
                width,
                scleraRadius,
                irisRadius,
                previousAngle,
            );
            expect(
                Math.abs(irisAdjustment.angle - previousAngle),
            ).toBeLessThanOrEqual(90);
            previousAngle = irisAdjustment.angle;
        });
    });
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
