import { EyeSide } from '../../../AppConstants';
import { setImageDataAction } from '../../../store/actions/video/actions';
import {
    IVideo,
    IVideoState,
    SET_VIDEO,
    SET_VIDEO_STREAMS,
    TOGGLE_WEBCAM_AVAILABLE,
    VideoActionTypes,
} from '../../../store/actions/video/types';
import videoStore from '../../../store/reducers/videoReducer';

export const testDevice1 = 'testDevice1';
export const testDevice2 = 'testDevice2';

const testDevice1Video: IVideo = {
    deviceId: testDevice1,
    width: 260,
    height: 380,
    stream: undefined,
};

const mockInitialState: { [deviceId: string]: IVideo } = {
    testDevice1: testDevice1Video,
};

const testDevice2Video: IVideo = {
    deviceId: testDevice2,
    width: 100,
    height: 100,
    stream: undefined,
};

export const mockTwoVideoStreams: { [deviceId: string]: IVideo } = {
    testDevice1: testDevice1Video,
    testDevice2: testDevice2Video,
};

let mockStore: IVideoState;

describe('Video Reducer', () => {
    beforeEach(() => {
        mockStore = videoStore(
            { videos: {}, webcamAvailable: false, images: {} },
            { type: SET_VIDEO_STREAMS, videos: mockInitialState },
        );
    });

    it('should return the initial state', () => {
        const expectedState: IVideoState = {
            videos: mockInitialState,
            webcamAvailable: false,
            images: {},
        };
        expect(mockStore).toEqual(expectedState);
    });

    it('should return a new state when dispaching Set Video Streams action', () => {
        const newState = videoStore(mockStore, {
            type: SET_VIDEO_STREAMS,
            videos: mockTwoVideoStreams,
        });
        const expectedState = {
            videos: {
                testDevice1: testDevice1Video,
                testDevice2: testDevice2Video,
            },
            webcamAvailable: false,
            images: {},
        };
        expect(newState).toEqual(expectedState);
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

    it('should toggle webcam available flag', () => {
        const newState = videoStore(mockStore, {
            type: TOGGLE_WEBCAM_AVAILABLE,
        });
        expect(newState.webcamAvailable).toBeTruthy();
    });
});
