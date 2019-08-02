import { number } from 'prop-types';
import { getImageData } from '../../__test_utils__/getImageData';
import { makeDetection } from '../../__test_utils__/makeDetection';
import { IDetection } from '../../models/objectDetection';
import { initialState as configStore } from '../../store/reducers/configReducer';
import { initialState as detectionStore } from '../../store/reducers/detectionReducer';
import { IRootStore } from '../../store/reducers/rootReducer';
import { initialState as videoStore } from '../../store/reducers/videoReducer';
import {
    getSelections,
    getSelectionsCombiner,
} from '../../store/selectors/detectionSelectors';
import { IColour, ICoords } from '../../utils/types';

describe('getSelectionCombiner', () => {
    const twoColoursImageData = getImageData(4, 4);
    const rootStore: IRootStore = {
        configStore,
        videoStore,
        detectionStore,
    };
    it('should return undefined when there are no detections', () => {
        expect(
            getSelectionsCombiner([], [], [], twoColoursImageData),
        ).toBeUndefined();
    });
    it('should return that selection when there is only one selection', () => {
        const detection = makeDetection(10, 10);
        const detections = [detection];
        expect(
            getSelectionsCombiner(detections, [], [], twoColoursImageData),
        ).toStrictEqual(detection);
    });
});
