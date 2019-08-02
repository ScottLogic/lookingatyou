import {
    ISetImageDataAction,
    ISetVideoAction,
    ISetVideoStreamsAction,
    IVideoState,
    VideoAction,
    VideoSetAction,
} from '../actions/video/types';

const clampedArray = new Uint8ClampedArray(0);

export const initialState: IVideoState = {
    webcamAvailable: false,
    video: { width: 0, height: 0, stream: undefined },
    image: { data: clampedArray, width: 0, height: 0 },
};

const videoActionMapping = {
    [VideoSetAction.IMAGE_DATA]: setImageData,
    [VideoSetAction.TOGGLE_WEBCAM]: toggleWebcam,
    [VideoSetAction.VIDEO]: setVideo,
    [VideoSetAction.VIDEO_STREAMS]: setVideoStreams,
};

const videoStore = (
    state: IVideoState = initialState,
    action: VideoAction,
): IVideoState => {
    return videoActionMapping.hasOwnProperty(action.type)
        ? videoActionMapping[action.type](state, action)
        : state;
};

function setImageData(state: IVideoState, action: VideoAction): IVideoState {
    return { ...state, image: (action as ISetImageDataAction).payload };
}

function setVideoStreams(state: IVideoState, action: VideoAction): IVideoState {
    return {
        ...state,
        video: { ...(action as ISetVideoStreamsAction).payload },
    };
}

function toggleWebcam(state: IVideoState, ignore: VideoAction): IVideoState {
    return { ...state, webcamAvailable: !state.webcamAvailable };
}

function setVideo(state: IVideoState, action: VideoAction): IVideoState {
    return {
        ...state,
        video: {
            ...state.video,
            videoElement: (action as ISetVideoAction).payload,
        },
    };
}

export default videoStore;
