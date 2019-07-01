import {
    IVideo,
    SET_VIDEO,
    SET_VIDEO_STREAMS,
    VideoActionTypes,
} from '../../../store/actions/video/types';
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

const mockInitialActionPayload: IVideo[] = [device1, device2];

let mockRootStore: IRootStore;

describe('Video Selectors', () => {
    beforeEach(() => {
        const mockVideoStore = videoStore(
            { videos: {} },
            { type: SET_VIDEO_STREAMS, videos: mockInitialActionPayload },
        );
        mockRootStore = { videoStore: mockVideoStore };
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
