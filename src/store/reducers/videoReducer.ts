import {
    IVideo,
    IVideoState,
    REMOVE_VIDEO_STREAM,
    SET_VIDEO,
    SET_VIDEO_STREAM,
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
        case SET_VIDEO_STREAM:
            const newVideo: { [deviceId: string]: IVideo } = {};
            newVideo[action.video.deviceId] = action.video;
            return {
                ...state,
                videos: {
                    ...state.videos,
                    ...newVideo,
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
        case REMOVE_VIDEO_STREAM:
            const newState = state;
            delete newState.videos[action.deviceId];
            return {
                ...state,
                ...newState,
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
