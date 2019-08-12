import React, { Fragment } from 'react';
import ReactTooltip from 'react-tooltip';

export enum HelpWith {
    APP_FPS = 'APP_FPS',
    APP_X_SENSITIVITY = 'APP_X_SENSITIVITY',
    APP_Y_SENSITIVITY = 'APP_Y_SENSITIVITY',
    ADV_VIDEO_STREAM = 'ADV_VIDEO_STREAM',
    APP_IRIS_COLOR = 'APP_IRIS_COLOR',
    ADV_DEBUG = 'ADV_DEBUG',
    ADV_REFLECTION = 'ADV_REFLECTION',
    ADV_REFLECTION_OPACITY = 'ADV_REFLECTION_OPACITY',
    ADV_ARCHITECTURE = 'ADV_ARCHITECTURE',
    ADV_OUTPUT_STRIDE = 'ADV_OUTPUT_STRIDE',
    ADV_RESOLUTION = 'ADV_RESOLUTION',
    ADV_MULTIPLIER = 'ADV_MULTIPLIER',
    ADV_DETECTIONS = 'ADV_DETECTIONS',
    ADV_MIN_SCORE = 'ADV_MIN_SCORE',
    ADV_NMS_RADIUS = 'ADV_NMS_RADIUS',
}

const fps = () => {
    return (
        <Fragment>
            How often the eyes will update in Frames per second. Affects
            performance.
        </Fragment>
    );
};

const xSense = () => {
    return <Fragment>How sensitively the eyes move horizontally.</Fragment>;
};

const ySense = () => {
    return <Fragment>How sensitively the eyes move vertically.</Fragment>;
};

const video = () => {
    return (
        <Fragment>
            Displays current webcam feed, outlines the person that is currently
            being tracked.
        </Fragment>
    );
};

const iris = () => {
    return <Fragment>Customise eye colour.</Fragment>;
};

const debug = () => {
    return (
        <Fragment>
            View the current camera feed, with tracked object highlighted.
            <br />
            Useful for setting up your cameras and environment.
        </Fragment>
    );
};

const reflectionOpacity = () => {
    return (
        <Fragment>
            Configure the opacity of the reflection. This does not affect
            performance.
        </Fragment>
    );
};

const reflection = () => {
    return (
        <Fragment>
            This checkbox allows you to view the currently selected target
            inside the pupil as a reflection.
        </Fragment>
    );
};

const architecture = () => {
    return (
        <Fragment>
            The model determines the speed and accuracy of the detection.
            <br />
            MobilNetV1 is faster whereas Resnet50 is more accurate.
        </Fragment>
    );
};

const outputStride = () => {
    return (
        <Fragment>
            Output Stride determines the output resolution of the model
            detection.
            <br />A higher output stride results in faster detection.
        </Fragment>
    );
};

const resolution = () => {
    return (
        <Fragment>
            The resolution determines the input resolution to the detection
            model.
            <br />
            Lower resolutions run faster.
        </Fragment>
    );
};

const multiplier = () => {
    return (
        <Fragment>
            The multiplier determines the depth of the CNN.
            <br />A lower value results in faster detections.
        </Fragment>
    );
};

const detections = () => {
    return (
        <Fragment>This value sets the maximum number of detections</Fragment>
    );
};

const minScore = () => {
    return (
        <Fragment>
            Sets the minimum certainty to commit to a prediction.
        </Fragment>
    );
};

const nmsRadius = () => {
    return (
        <Fragment>
            This value adjusts the non-maximum-supression radius in pixels. This
            prevents multiple
            <br />
            detections being made in within the specified number of pixels.
        </Fragment>
    );
};

interface IHelpSectionMap {
    [id: string]: () => JSX.Element;
}

const helpSections: IHelpSectionMap = {
    APP_FPS: fps,
    APP_X_SENSITIVITY: xSense,
    APP_Y_SENSITIVITY: ySense,
    ADV_VIDEO_STREAM: video,
    APP_IRIS_COLOR: iris,
    ADV_DEBUG: debug,
    ADV_REFLECTION: reflection,
    ADV_REFLECTION_OPACITY: reflectionOpacity,
    ADV_ARCHITECTURE: architecture,
    ADV_OUTPUT_STRIDE: outputStride,
    ADV_RESOLUTION: resolution,
    ADV_MULTIPLIER: multiplier,
    ADV_DETECTIONS: detections,
    ADV_MIN_SCORE: minScore,
    ADV_NMS_RADIUS: nmsRadius,
};

function text(section: HelpWith) {
    const Component = helpSections[HelpWith[section]];
    return <Component />;
}

interface IHelpProps {
    problemWith: HelpWith;
}

function Help(props: IHelpProps) {
    return (
        <div className={HelpWith[props.problemWith]}>
            <ReactTooltip
                id={HelpWith[props.problemWith]}
                place="right"
                type="dark"
                effect="solid"
            >
                <span>{text(props.problemWith)}</span>
            </ReactTooltip>
        </div>
    );
}

export default Help;
