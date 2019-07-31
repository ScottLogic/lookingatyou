import {
    IVideoState,
    SET_VIDEO,
    SET_VIDEO_STREAMS,
    VideoActionTypes,
} from '../../../store/actions/video/types';
import { initialState as initialConfigStore } from '../../../store/reducers/configReducer';
import { initialState as initialDetectionStore } from '../../../store/reducers/detectionReducer';
import { IRootStore } from '../../../store/reducers/rootReducer';
import videoStore from '../../../store/reducers/videoReducer';
import * as selectors from '../../../store/selectors/videoSelectors';
import { testDevice1, testDevice2 } from './videoReducer.test';

const device1 = {
    deviceId: testDevice1,
    width: 260,
    height: 380,
    stream: undefined,
};

const device2 = {
    deviceId: testDevice2,
    width: 480,
    height: 640,
    stream: undefined,
};

const array = new Uint8ClampedArray(0);
const video = { width: 0, height: 0, stream: undefined };
const imgData = { width: 0, height: 0, data: array };

let mockRootStore: IRootStore;
let mockVideoStore: IVideoState;

describe('Video Selectors', () => {
    beforeEach(() => {
        mockVideoStore = videoStore(
            { video, webcamAvailable: false, image: imgData },
            { type: SET_VIDEO_STREAMS, video: device1 },
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
