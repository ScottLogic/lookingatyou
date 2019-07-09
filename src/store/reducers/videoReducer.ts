import {
    IVideo,
    IVideoState,
    SET_VIDEO,
    SET_VIDEO_STREAMS,
    TOGGLE_WEBCAM_AVAILABLE,
    VideoActionTypes,
} from '../actions/video/types';

export const initialState: IVideoState = {
    webcamAvailable: false,
    videos: {},
};

const videoStore = (
    state: IVideoState = initialState,
    action: VideoActionTypes,
): IVideoState => {
    switch (action.type) {
        case SET_VIDEO_STREAMS:
            return {
                ...state,
                videos: {
                    ...action.videos,
                },
            };
        case SET_VIDEO:
            const elementId = action.payload.deviceId;
            const updatedObject: { [key: string]: IVideo } = {};
            updatedObject[elementId] = {
                ...state.videos[elementId],
                ...action.payload,
            };
            return {
                ...state,
                videos: {
                    ...state.videos,
                    ...updatedObject,
                },
            };
        case TOGGLE_WEBCAM_AVAILABLE:
            return {
                ...state,
                webcamAvailable: !state.webcamAvailable,
            };
        default:
            return state;
    }
};

export default videoStore;
