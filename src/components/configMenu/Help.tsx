import React, { Fragment } from 'react';
import ReactTooltip from 'react-tooltip';

export enum HelpWith {
    FPS = 'FPS',
    X_SENSITIVITY = 'X_SENSITIVITY',
    Y_SENSITIVITY = 'Y_SENSITIVITY',
    VIDEO_STREAM = 'VIDEO_STREAM',
    SWAP_EYES = 'SWAP_EYES',
    IRIS_COLOUR = 'IRIS_COLOUR',
    APP = 'APP',
    DEBUG = 'DEBUG',
    REFLECTION = 'REFLECTION',
    REFLECTION_OPACITY = 'REFLECTION_OPACITY',
}

const fps = () => {
    return (
        <Fragment>
            How often the eyes will update in Frames per second. Effects
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

const swap = () => {
    return (
        <Fragment>
            Swap the eyes when using two cameras, to correctly set left camera
            to left eye and right camera to right eye.
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
            Configure the opacity of the reflection. This does not effect
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

interface IHelpSectionMap {
    [id: string]: () => JSX.Element;
}

const helpSections: IHelpSectionMap = {
    FPS: fps,
    X_SENSITIVITY: xSense,
    Y_SENSITIVITY: ySense,
    VIDEO_STREAM: video,
    SWAP_EYES: swap,
    IRIS_COLOUR: iris,
    APP: app,
    DEBUG: debug,
    REFLECTION: reflection,
    REFLECTION_OPACITY: reflectionOpacity,
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
