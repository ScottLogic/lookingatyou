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

const mockTwoVideoStreams = {
    testDevice1: device1,
    testDevice2: device2,
};

let mockRootStore: IRootStore;
let mockVideoStore: IVideoState;

describe('Video Selectors', () => {
    beforeEach(() => {
        mockVideoStore = videoStore(
            { videos: {}, webcamAvailable: false },
            { type: SET_VIDEO_STREAMS, videos: mockTwoVideoStreams },
        );
        mockRootStore = {
            videoStore: mockVideoStore,
            configStore: initialConfigState,
            detectionStore: initialDetectionState,
        };
    });

    it('should return deviceIds from the store', () => {
        const expectedResult = [testDevice1, testDevice2];
        expect(selectors.getDeviceIds(mockRootStore)).toEqual(expectedResult);
    });

    it('should return stream for specified device', () => {
        expect(
            selectors.getStreamForDevice(mockRootStore, testDevice2),
        ).toEqual(device2);
    });

    it('should return video elements for each device', () => {
        const videoElement = document.createElement('video');
        const mockSetVideoActionDevice1: VideoActionTypes = {
            type: SET_VIDEO,
            payload: {
                deviceId: testDevice1,
                video: videoElement,
            },
        };
        mockRootStore.videoStore = videoStore(
            mockRootStore.videoStore,
            mockSetVideoActionDevice1,
        );
        expect(selectors.getVideos(mockRootStore)).toEqual([
            videoElement,
            undefined,
        ]);
    });
});
