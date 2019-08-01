import * as actions from '../../../store/actions/video/actions';
import {
    SET_VIDEO,
    SET_VIDEO_STREAMS,
    TOGGLE_WEBCAM_AVAILABLE,
} from '../../../store/actions/video/types';
import { mockTwoVideoStreams } from './videoReducer.test';

describe('Video Actions', () => {
    it('should create an action to add a video stream', () => {
        const expectedAction = {
            type: SET_VIDEO_STREAMS,
            payload: mockTwoVideoStreams,
        };
        expect(actions.setVideoStreamsAction(mockTwoVideoStreams)).toEqual(
            expectedAction,
        );
    });

    it('should create an action to add a video html element', () => {
        const videoElement = document.createElement('video');
        const payload = { deviceId: 'deviceId', video: videoElement };

        const expectedAction = {
            type: SET_VIDEO,
            payload,
        };
        expect(actions.setVideoAction(payload)).toEqual(expectedAction);
    });

    it('should create an action to toggle the webcam', () => {
        const expectedAction = { type: TOGGLE_WEBCAM_AVAILABLE };
        expect(actions.toggleWebcamAvailable()).toEqual(expectedAction);
    });
});
