import * as actions from '../../../store/actions/video/actions';
import {
    SET_VIDEO,
    SET_VIDEO_STREAM,
    TOGGLE_WEBCAM_AVAILABLE,
} from '../../../store/actions/video/types';

describe('Video Actions', () => {
    it('should create an action to add a video stream', () => {
        const mockVideoStream = { width: 320, height: 640 };
        const expectedAction = {
            type: SET_VIDEO_STREAM,
            payload: mockVideoStream,
        };
        expect(actions.setVideoStreamAction(mockVideoStream)).toEqual(
            expectedAction,
        );
    });

    it('should create an action to add a video html element', () => {
        const videoElement = document.createElement('video');
        const payload = videoElement;

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
