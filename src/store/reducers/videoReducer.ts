import {
    IVideoState,
    SET_IMAGE_DATA,
    SET_VIDEO,
    SET_VIDEO_STREAMS,
    TOGGLE_WEBCAM_AVAILABLE,
    VideoActionTypes,
} from '../actions/video/types';

const clampedArray = new Uint8ClampedArray(0);

export const initialState: IVideoState = {
    webcamAvailable: false,
    video: { width: 0, height: 0, stream: undefined },
    image: { data: clampedArray, width: 0, height: 0 },
};

const videoStore = (
    state: IVideoState = initialState,
    action: VideoActionTypes,
): IVideoState => {
    switch (action.type) {
        case SET_VIDEO_STREAMS:
            return {
                ...state,
                video: {
                    ...action.video,
                },
            };
        case SET_VIDEO:
            return {
                ...state,
                video: { ...state.video, videoElement: action.payload },
            };
        case TOGGLE_WEBCAM_AVAILABLE:
            return {
                ...state,
                webcamAvailable: !state.webcamAvailable,
            };
        case SET_IMAGE_DATA:
            return {
                ...state,
                image: action.image,
            };
        default:
            return state;
    }
};

export default videoStore;
