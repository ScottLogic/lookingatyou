import {
    IVideoState,
    SET_VIDEO_STREAMS,
} from '../../../store/actions/video/types';
import { initialConfig as initialConfigStore } from '../../../store/reducers/configReducer';
import { initialState as initialDetectionStore } from '../../../store/reducers/detectionReducer';
import { IRootStore } from '../../../store/reducers/rootReducer';
import videoStore from '../../../store/reducers/videoReducer';
import * as selectors from '../../../store/selectors/videoSelectors';

const device1 = {
    width: 260,
    height: 380,
    stream: undefined,
};

const video = { width: 0, height: 0, stream: undefined };
const imgData = { width: 0, height: 0, data: new Uint8ClampedArray(0) };

let mockRootStore: IRootStore;
let mockVideoStore: IVideoState;

describe('Video Selectors', () => {
    beforeEach(() => {
        mockVideoStore = videoStore(
            { video, webcamAvailable: false, image: imgData },
            { type: SET_VIDEO_STREAMS, payload: device1 },
        );
        mockRootStore = {
            videoStore: mockVideoStore,
            configStore: initialConfigStore,
            detectionStore: initialDetectionStore,
        };
    });

    it('should return stream for specified device', () => {
        expect(selectors.getStreamForDevice(mockRootStore)).toEqual(device1);
    });
});
