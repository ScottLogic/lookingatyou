import { eyelidPosition } from '../../../AppConstants';
import { IDetection } from '../../../models/objectDetection';
import { setDetections } from '../../../store/actions/detections/actions';
import { IDetectionState } from '../../../store/actions/detections/types';
import configStore from '../../../store/reducers/configReducer';
import detectionStore, {
    initialState,
} from '../../../store/reducers/detectionReducer';
import { IColour, ICoords } from '../../../utils/types';

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
    beforeEach(() => {});
    it('should update detections correctly', () => {
        const detections: IDetection[] = [
            { bbox: [1, 1, 1, 1], info: { keypoints: [], score: 5 } },
        ];
        const previousTarget: ICoords = { x: 10, y: 15 };
        const previousColour: IColour = { r: 15, g: 15, b: 50 };
        const action = setDetections({
            detections,
            previousTarget,
            previousColour,
        });
        const expected: IDetectionState = {
            ...testState,
            detections,
            history: [{ colour: previousColour, target: previousTarget }],
        };
        expect(detectionStore(testState, action)).toStrictEqual(expected);
    });
});
