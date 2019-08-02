import { number } from 'prop-types';
import { getImageData } from '../../__test_utils__/getImageData';
import { IDetection } from '../../models/objectDetection';
import { getSelections } from '../../store/selectors/detectionSelectors';
import { IColour, ICoords } from '../../utils/types';

describe('getSelections', () => {
    const detections: IDetection[] = [];
    const previousTargets: ICoords[] = [{ x: 0, y: 0 }];
    const previousColours: IColour[] = [{ r: 0, g: 0, b: 0 }];
    const imageData = getImageData(4, 4);
});
