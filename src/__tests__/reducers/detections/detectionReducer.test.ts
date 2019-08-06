import { eyelidPosition, targetingConsts } from '../../../AppConstants';
import { IDetection } from '../../../models/objectDetection';
import {
    setAnimation,
    setDetections,
    setIdleTarget,
    setOpen,
    swapSelection,
} from '../../../store/actions/detections/actions';
import { IDetectionState } from '../../../store/actions/detections/types';
import detectionStore from '../../../store/reducers/detectionReducer';
import { Animation } from '../../../utils/pose/animations';
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

    const testDetection: IDetection = {
        bbox: [1, 1, 1, 1],
        info: { keypoints: [], score: 5 },
    };
    const testDetections: IDetection[] = [testDetection];
    const testTarget: ICoords = { x: 10, y: 15 };
    const testColour: IColour = { r: 20, g: 25, b: 30 };
    const testAction = setDetections({
        detections: testDetections,
        previousTarget: testTarget,
        previousColour: testColour,
    });
    it('should update detections and history when history is empty', () => {
        const expected: IDetectionState = {
            ...testState,
            detections: testDetections,
            history: [{ colour: testColour, target: testTarget }],
        };
        expect(detectionStore(testState, testAction)).toStrictEqual(expected);
    });
    it('should update detections and history correctly when history is neither empty nor full', () => {
        if (targetingConsts.maxNum > 1) {
            const initialState = {
                ...testState,
                history: [
                    {
                        target: { x: 0, y: 0 },
                        colour: { r: 0, g: 0, b: 0 },
                    },
                ],
            };
            const expected = {
                ...initialState,
                detections: testDetections,
                history: [
                    {
                        target: { x: 0, y: 0 },
                        colour: { r: 0, g: 0, b: 0 },
                    },
                    {
                        target: testTarget,
                        colour: testColour,
                    },
                ],
            };
            expect(detectionStore(initialState, testAction)).toStrictEqual(
                expected,
            );
        }
    });
    it('should update detections history correctly when history is at maximum length', () => {
        const initialHistory: IHistory[] = [];

        for (let i = 0; i < targetingConsts.maxNum; i++) {
            initialHistory.push({
                target: { x: i, y: i },
                colour: { r: i, g: i, b: i },
            });
        }

        expect(initialHistory.length).toBe(targetingConsts.maxNum);
        const initialState = { ...testState, history: initialHistory };

        const expectedHistory = initialHistory.slice(1, targetingConsts.maxNum);
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
    it('history should be cleared on swap selection, and there should only be one detection', () => {
        const nextSelectionSwapTime = 5000;
        const action = swapSelection({
            selection: testDetection,
            nextSelectionSwapTime,
        });
        const expected = {
            ...testState,
            detections: testDetections,
            history: [],
            nextSelectionSwapTime,
        };
        expect(detectionStore(testState, action)).toStrictEqual(expected);
    });

    it('should update open coefficient correctly', () => {
        const eyesOpenCoefficient = 0.3;
        const action = setOpen(eyesOpenCoefficient);
        const expected = {
            ...testState,
            eyesOpenCoefficient,
        };
        expect(detectionStore(testState, action)).toStrictEqual(expected);
    });

    it('should update animation correctly', () => {
        const animation: Animation = [
            {
                normalisedCoords: { x: 5, y: 6 },
                openCoefficient: 0.2,
                dilation: 6,
                irisColor: 'red',
                duration: 10,
            },
            {
                normalisedCoords: { x: 50, y: 60 },
                openCoefficient: 0.02,
                dilation: 56,
                irisColor: 'red',
                duration: 120,
            },
        ];
        const action = setAnimation(animation);
        const expected = {
            ...testState,
            animation,
        };
        expect(detectionStore(testState, action)).toStrictEqual(expected);
    });

    it('should update idle target correctly', () => {
        const idleTarget = { x: 500, y: 755 };
        const action = setIdleTarget(idleTarget);
        const expected = { ...testState, idleTarget };
        expect(detectionStore(testState, action)).toStrictEqual(expected);
    });
});
