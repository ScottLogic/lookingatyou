import * as actions from '../../../store/actions/video/actions';
import {
    SET_VIDEO,
    SET_VIDEO_STREAMS,
} from '../../../store/actions/video/types';
import { mockSetVideoStreamsPayload } from './videoReducer.test';

describe('Video Actions', () => {
    it('should create an action to add a video stream', () => {
        const expectedAction = {
            type: SET_VIDEO_STREAMS,
            videos: [mockSetVideoStreamsPayload],
        };
        expect(
            actions.setVideoStreamsAction([mockSetVideoStreamsPayload]),
        ).toEqual(expectedAction);
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
});
