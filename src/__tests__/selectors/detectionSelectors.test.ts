import { number } from 'prop-types';
import { getImageData } from '../../__test_utils__/getImageData';
import { IDetection } from '../../models/objectDetection';
import { initialState as configStore } from '../../store/reducers/configReducer';
import { initialState as detectionStore } from '../../store/reducers/detectionReducer';
import { IRootStore } from '../../store/reducers/rootReducer';
import { initialState as videoStore } from '../../store/reducers/videoReducer';
import { getSelections } from '../../store/selectors/detectionSelectors';
import { IColour, ICoords } from '../../utils/types';

describe('getSelections', () => {
    const twoColoursImageData = getImageData(4, 4);
    const rootStore: IRootStore = {
        configStore,
        videoStore,
        detectionStore,
    };
    it('should return undefined when there are no detections', () => {
        expect(getSelections(rootStore)).toBeUndefined();
    });
});
