import { stat } from 'fs';
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
        default:
            return state;
    }
};

export default videoStore;
