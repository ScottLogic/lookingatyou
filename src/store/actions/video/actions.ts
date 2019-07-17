import {
    ISetVideoPayload,
    IVideo,
    SET_IMAGE_DATA,
    SET_VIDEO,
    SET_VIDEO_STREAMS,
    VideoActionTypes,
} from './types';

export function setVideoAction(payload: ISetVideoPayload): VideoActionTypes {
    return {
        type: SET_VIDEO,
        payload,
    };
}

export function setVideoStreamsAction(videos: IVideo[]): VideoActionTypes {
    return {
        type: SET_VIDEO_STREAMS,
        videos,
    };
}

export function setImageDataAction(images: ImageData[]): VideoActionTypes {
    return {
        type: SET_IMAGE_DATA,
        images,
    };
}
