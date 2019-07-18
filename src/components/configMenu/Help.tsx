import React, { Fragment } from 'react';
import ReactTooltip from 'react-tooltip';

export enum HelpWith {
    MODEL = 'MODEL',
    FPS = 'FPS',
    X_SENSITIVITY = 'X_SENSITIVITY',
    Y_SENSITIVITY = 'Y_SENSITIVITY',
    VIDEO_STREAM = 'VIDEO_STREAM',
    LEFT_VIDEO_STREAM = 'LEFT_VIDEO_STREAM',
    RIGHT_VIDEO_STREAM = 'RIGHT_VIDEO_STREAM',
    SWAP_EYES = 'SWAP_EYES',
    IRIS_COLOUR = 'IRIS_COLOUR',
    APP = 'APP',
    DEBUG = 'DEBUG',
}

const model = () => {
    return (
        <Fragment>
            This sets the model running in the background. Posenet runs faster
            and is more accurate.
            <br /> CocoSSD is supported for legacy reasons.
        </Fragment>
    );
};

const fps = () => {
    return (
        <Fragment>
            This number sets how often the eyes will update in Frames per
            Second.
        </Fragment>
    );
};

const xSense = () => {
    return (
        <Fragment>
            This number sets how sensitive the eyes will be from left to right.
        </Fragment>
    );
};

const ySense = () => {
    return (
        <Fragment>
            This number sets how sensitive the eyes will be from top to bottom.
        </Fragment>
    );
};

const video = () => {
    return (
        <Fragment>
            This shows you the current webcam feed, and outlines the person that
            is currently being tracked.
        </Fragment>
    );
};

const swap = () => {
    return (
        <Fragment>
            This allows you to swap the eyes when using two cameras so you can
            correctly set the left and the right.
        </Fragment>
    );
};

const iris = () => {
    return (
        <Fragment>
            This button allows you to select the colour of the eyes.
        </Fragment>
    );
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

const leftVid = () => {
    return (
        <Fragment>
            This shows you the current webcam feed from the left camera, and
            outlines the person that is currently being tracked.
        </Fragment>
    );
};

const rightVid = () => {
    return (
        <Fragment>
            This shows you the current webcam feed from the right camera, and
            outlines the person that is currently being tracked.
        </Fragment>
    );
};

const debug = () => {
    return (
        <Fragment>
            This checkbox allows you to view the current camera feed from either
            one or two cameras.
            <br /> It will also show you what object is being tracked.
        </Fragment>
    );
};

interface IHelpSectionMap {
    [id: string]: () => JSX.Element;
}

const helpSections: IHelpSectionMap = {
    MODEL: model,
    FPS: fps,
    X_SENSITIVITY: xSense,
    Y_SENSITIVITY: ySense,
    VIDEO_STREAM: video,
    SWAP_EYES: swap,
    IRIS_COLOUR: iris,
    APP: app,
    LEFT_VIDEO_STREAM: leftVid,
    RIGHT_VIDEO_STREAM: rightVid,
    DEBUG: debug,
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
