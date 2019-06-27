import {
    IVideo,
    IVideoState,
    SET_VIDEO,
    SET_VIDEO_STREAMS,
    VideoActionTypes,
} from '../../../store/actions/video/types';
import videoStore from '../../../store/reducers/videoReducer';

const testDevice1 = 'testDevice1';
const testDevice2 = 'testDevice2';

const mockInitialAction: IVideo = {
    deviceId: testDevice1,
    width: 260,
    height: 380,
    stream: undefined,
};

const mockSetVideoStreamsPayload: IVideo = {
    deviceId: testDevice2,
    width: 100,
    height: 100,
    stream: undefined,
};

const mockSetVideoStreamsAction: VideoActionTypes = {
    type: SET_VIDEO_STREAMS,
    videos: [mockSetVideoStreamsPayload],
};

let mockStore: IVideoState;

describe('Video Reducer', () => {
    beforeEach(() => {
        mockStore = videoStore(
            { videos: {} },
            { type: SET_VIDEO_STREAMS, videos: [mockInitialAction] },
        );
    });

    it('should return the initial state', () => {
        const expectedState: IVideoState = {
            videos: {
                testDevice1: mockInitialAction,
            },
        };
        expect(mockStore).toStrictEqual(expectedState);
    });

    it('should return a new state when dispaching Set Video Streams action', () => {
        const newState = videoStore(mockStore, mockSetVideoStreamsAction);
        const expectedState = {
            videos: {
                testDevice1: mockInitialAction,
                testDevice2: mockSetVideoStreamsPayload,
            },
        };
        expect(newState).toStrictEqual(expectedState);
    });

    it('should add HTML element when dispatching Set Vide action', () => {
        const videoElement = document.createElement('video');
        const mockSetVideoAction: VideoActionTypes = {
            type: SET_VIDEO,
            payload: {
                deviceId: testDevice1,
                video: videoElement,
            },
        };
        const newState = videoStore(mockStore, mockSetVideoAction);
        const expectedState = mockStore;
        expectedState.videos[testDevice1].video = videoElement;
        expect(newState).toEqual(expectedState);
    });
});
