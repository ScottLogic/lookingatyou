import React, { Fragment } from 'react';
import ReactTooltip from 'react-tooltip';

export enum HelpWith {
    FPS = 'FPS',
    X_SENSITIVITY = 'X_SENSITIVITY',
    Y_SENSITIVITY = 'Y_SENSITIVITY',
    VIDEO_STREAM = 'VIDEO_STREAM',
    IRIS_COLOUR = 'IRIS_COLOUR',
    APP = 'APP',
    DEBUG = 'DEBUG',
    REFLECTION = 'REFLECTION',
    REFLECTION_OPACITY = 'REFLECTION_OPACITY',
    ARCHITECTURE = 'ARCHITECTURE',
    OUTPUT_STRIDE = 'OUTPUT_STRIDE',
    RESOLUTION = 'RESOLUTION',
    MULTIPLIER = 'MULTIPLIER',
    DETECTIONS = 'DETECTIONS',
    FLIP = 'FLIP',
    MIN_SCORE = 'MIN_SCORE',
    NMS_RADIUS = 'NMS_RADIUS',
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

const app = () => {
    return (
        <Fragment>
            This is an app designed to track users using a webcam.
            <br /> The eyes will follow you around and react differently
            depending on what they see.
            <br /> Hover over any of the menu items for more information.
        </Fragment>
    );
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

const flip = () => {
    return (
        <Fragment>
            When checked this value horizontally flips the location of the
            detected target.
            <br />
            This is useful for mirroring poses.
        </Fragment>
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
    FPS: fps,
    X_SENSITIVITY: xSense,
    Y_SENSITIVITY: ySense,
    VIDEO_STREAM: video,
    IRIS_COLOUR: iris,
    APP: app,
    DEBUG: debug,
    REFLECTION: reflection,
    REFLECTION_OPACITY: reflectionOpacity,
    ARCHITECTURE: architecture,
    OUTPUT_STRIDE: outputStride,
    RESOLUTION: resolution,
    MULTIPLIER: multiplier,
    DETECTIONS: detections,
    FLIP: flip,
    MIN_SCORE: minScore,
    NMS_RADIUS: nmsRadius,
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
