import { eyelidPosition, targetingConsts } from '../../../AppConstants';
import { IDetection } from '../../../models/objectDetection';
import {
    setAnimation,
    setDetections,
    setOpen,
    swapSelection,
} from '../../../store/actions/detections/actions';
import { IDetectionState } from '../../../store/actions/detections/types';
import detectionStore, {
    initialState,
} from '../../../store/reducers/detectionReducer';
import { Animation } from '../../../utils/pose/animations';
import { IColor, ICoords, IHistory } from '../../../utils/types';

describe('Detection Reducer Tests', () => {
    const testDetection: IDetection = {
        bbox: [1, 1, 1, 1],
        info: { keypoints: [], score: 5 },
    };
    const testDetections: IDetection[] = [testDetection];
    const testTarget: ICoords = { x: 10, y: 15 };
    const testColor: IColor = { r: 20, g: 25, b: 30 };
    const testAction = setDetections({
        detections: testDetections,
        previousTarget: testTarget,
        previousColor: testColor,
    });
    it('should update detections and history when history is empty', () => {
        const expected: IDetectionState = {
            ...initialState,
            detections: testDetections,
            history: [{ color: testColor, target: testTarget }],
        };
        expect(detectionStore(initialState, testAction)).toStrictEqual(
            expected,
        );
    });
    it('should update detections and history correctly when history is neither empty nor full', () => {
        if (targetingConsts.maxNum > 1) {
            const modifiedInitialState = {
                ...initialState,
                history: [
                    {
                        target: { x: 0, y: 0 },
                        color: { r: 0, g: 0, b: 0 },
                    },
                ],
            };
            const expected = {
                ...modifiedInitialState,
                detections: testDetections,
                history: [
                    {
                        target: { x: 0, y: 0 },
                        color: { r: 0, g: 0, b: 0 },
                    },
                    {
                        target: testTarget,
                        color: testColor,
                    },
                ],
            };
            expect(
                detectionStore(modifiedInitialState, testAction),
            ).toStrictEqual(expected);
        }
    });
    it('should update detections history correctly when history is at maximum length', () => {
        const initialHistory: IHistory[] = [];

        for (let i = 0; i < targetingConsts.maxNum; i++) {
            initialHistory.push({
                target: { x: i, y: i },
                color: { r: i, g: i, b: i },
            });
        }

        expect(initialHistory.length).toBe(targetingConsts.maxNum);
        const modifiedInitialState = {
            ...initialState,
            history: initialHistory,
        };

        const expectedHistory = initialHistory.slice(1, targetingConsts.maxNum);
        expectedHistory.push({ target: testTarget, color: testColor });
        const expected = {
            ...modifiedInitialState,
            detections: testDetections,
            history: expectedHistory,
        };
        expect(detectionStore(modifiedInitialState, testAction)).toStrictEqual(
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
            ...initialState,
            detections: testDetections,
            history: [],
            nextSelectionSwapTime,
        };
        expect(detectionStore(initialState, action)).toStrictEqual(expected);
    });

    it('should update open coefficient correctly', () => {
        const eyesOpenCoefficient = 0.3;
        const action = setOpen(eyesOpenCoefficient);
        const expected = {
            ...initialState,
            eyesOpenCoefficient,
        };
        expect(detectionStore(initialState, action)).toStrictEqual(expected);
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
            ...initialState,
            animation,
        };
        expect(detectionStore(initialState, action)).toStrictEqual(expected);
    });
});
