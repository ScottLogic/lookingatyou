import { Button } from '@material-ui/core';
import React, { Fragment } from 'react';
import Popup from 'reactjs-popup';

export default function NoWebcamPopup() {
    return (
        <Popup
            open={true}
            modal={true}
            closeOnDocumentClick={false}
            closeOnEscape={false}
        >
            {close => (
                <Fragment>
                    <h1>Looking At You</h1>
                    This is an app designed to track users using a webcam. The
                    eyes will follow you around and react differently depending
                    on what they see. Basic webcamless functionality is
                    available (try moving your mouse after you close this
                    window!) but for the full experience, please connect a
                    webcam.
                    <br />
                    <Button
                        variant="contained"
                        className="accept"
                        color="primary"
                        onClick={close}
                    >
                        Close
                    </Button>
                </Fragment>
            )}
        </Popup>
    );
}
