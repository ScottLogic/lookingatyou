import {
    ISetImageDataAction,
    ISetVideoAction,
    ISetVideoStreamsAction,
    IVideo,
    IVideoState,
    VideoAction,
    VideoSetAction,
} from '../actions/video/types';

export const initialState: IVideoState = {
    webcamAvailable: false,
    videos: {},
    images: {},
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
    return { ...state, images: (action as ISetImageDataAction).payload };
}

function setVideoStreams(state: IVideoState, action: VideoAction): IVideoState {
    return {
        ...state,
        videos: { ...(action as ISetVideoStreamsAction).payload },
    };
}

function toggleWebcam(state: IVideoState, ignore: VideoAction): IVideoState {
    return { ...state, webcamAvailable: !state.webcamAvailable };
}

function setVideo(state: IVideoState, action: VideoAction): IVideoState {
    const elementId = (action as ISetVideoAction).payload.deviceId;
    const updatedObject: { [key: string]: IVideo } = {};
    updatedObject[elementId] = {
        ...state.videos[elementId],
        ...(action as ISetVideoAction).payload,
    };
    return {
        ...state,
        videos: {
            ...state.videos,
            ...updatedObject,
        },
    };
}

export default videoStore;
