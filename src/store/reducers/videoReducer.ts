import {
    IVideo,
    IVideoState,
    SET_IMAGE_DATA,
    SET_VIDEO,
    SET_VIDEO_STREAMS,
    VideoActionTypes,
} from '../actions/video/types';

export const initialState: IVideoState = {
    videos: {},
    images: {},
};

const videoStore = (
    state: IVideoState = initialState,
    action: VideoActionTypes,
): IVideoState => {
    switch (action.type) {
        case SET_VIDEO_STREAMS:
            const newVideos: { [deviceId: string]: IVideo } = {};
            action.videos.map(
                (video: IVideo) => (newVideos[video.deviceId] = video),
            );
            return {
                ...state,
                videos: {
                    ...state.videos,
                    ...newVideos,
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
        case SET_IMAGE_DATA:
            return {
                ...state,
                images: {
                    ...state.images,
                    ...action.images,
                },
            };
        default:
            return state;
    }
};

export default videoStore;
