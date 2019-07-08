import React, { Fragment } from 'react';
import ReactTooltip from 'react-tooltip';

export enum HelpWith {
    FPS,
    X_SENSITIVITY,
    Y_SENSITIVITY,
    VIDEO_STREAM,
    SWAP_EYES,
    IRIS_COLOUR,
    APP,
}

const text = (section: HelpWith) => {
    switch (section) {
        case HelpWith.FPS:
            return (
                <Fragment>
                    This number sets how often the eyes will update in Frames
                    per Second.
                </Fragment>
            );
        case HelpWith.X_SENSITIVITY:
            return (
                <Fragment>
                    This number sets how sensitive the eyes will be from left to
                    right.
                </Fragment>
            );
        case HelpWith.Y_SENSITIVITY:
            return (
                <Fragment>
                    This number sets how sensitive the eyes will be from top to
                    bottom.
                </Fragment>
            );
        case HelpWith.VIDEO_STREAM:
            return (
                <Fragment>
                    This shows you the current webcam feed, and outlines the
                    person that is currently being tracked.
                </Fragment>
            );
        case HelpWith.SWAP_EYES:
            return (
                <Fragment>
                    This allows you to swap the eyes when using two cameras so
                    you can correctly set the left and the right.
                </Fragment>
            );
        case HelpWith.IRIS_COLOUR:
            return (
                <Fragment>
                    This button allows you to select the colour of the eyes.
                </Fragment>
            );
        case HelpWith.APP:
            return (
                <Fragment>
                    This is an app designed to track users using a webcam. The
                    eyes will follow you around and react differently depending
                    on what they see. Hover over any of the menu items for more
                    information.
                </Fragment>
            );
        default:
            return '';
    }
};

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
