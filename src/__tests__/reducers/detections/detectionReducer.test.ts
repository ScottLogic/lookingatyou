import { eyelidPosition, targetingConsts } from '../../../AppConstants';
import { IDetection } from '../../../models/objectDetection';
import { setDetections } from '../../../store/actions/detections/actions';
import { IDetectionState } from '../../../store/actions/detections/types';
import detectionStore from '../../../store/reducers/detectionReducer';
import { IColour, ICoords, IHistory } from '../../../utils/types';

describe('Detection Reducer Tests', () => {
    const testState: IDetectionState = {
        model: null,
        idleTarget: { x: 0, y: 0 },
        detections: [],
        eyesOpenCoefficient: eyelidPosition.OPEN,
        detectionInterval: 0,
        animation: [],
        nextSelectionSwapTime: -1,
        history: [],
    };

    const testDetections: IDetection[] = [
        { bbox: [1, 1, 1, 1], info: { keypoints: [], score: 5 } },
    ];
    const testTarget: ICoords = { x: 10, y: 15 };
    const testColour: IColour = { r: 20, g: 25, b: 30 };
    const testAction = setDetections({
        detections: testDetections,
        previousTarget: testTarget,
        previousColour: testColour,
    });
    it('should update detections and history correctly in the simplest case', () => {
        const expected: IDetectionState = {
            ...testState,
            detections: testDetections,
            history: [{ colour: testColour, target: testTarget }],
        };
        expect(detectionStore(testState, testAction)).toStrictEqual(expected);
    });
    it('should update history correctly when history is at maximum length', () => {
        const initialHistory: IHistory[] = [];

        for (let i = 0; i < targetingConsts.maxNum; i++) {
            initialHistory.push({
                target: { x: i, y: i },
                colour: { r: i, g: i, b: i },
            });
        }

        expect(initialHistory.length).toBe(targetingConsts.maxNum);
        const initialState = { ...testState, history: initialHistory };

        const expectedHistory = [
            ...initialHistory.slice(1, targetingConsts.maxNum),
        ];
        expectedHistory.push({ target: testTarget, colour: testColour });
        const expected = {
            ...initialState,
            detections: testDetections,
            history: expectedHistory,
        };
        expect(detectionStore(initialState, testAction)).toStrictEqual(
            expected,
        );
    });
});
