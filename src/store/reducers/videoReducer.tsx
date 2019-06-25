import {
    IVideo,
    IVideoState,
    SET_VIDEO,
    SET_VIDEO_STREAMS,
    VideoActionTypes,
} from '../actions/video/types';

export const initialState: IVideoState = {
    videos: {},
};

const videoStore = (
    state: IVideoState = initialState,
    action: VideoActionTypes,
): IVideoState => {
    switch (action.type) {
        case SET_VIDEO_STREAMS:
            const videos: { [deviceId: string]: IVideo } = {};
            action.videos.map(
                (video: IVideo) => (videos[video.deviceId] = video),
            );
            return { ...state, videos };
        case SET_VIDEO:
            return {
                ...state,
                ...(state.videos[action.payload.deviceId].video =
                    action.payload.video),
            };
        default:
            return state;
    }
};

export default videoStore;
