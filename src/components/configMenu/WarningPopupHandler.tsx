import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import { PartialConfig } from '../../store/actions/config/types';
import './WarningPopupHandler.css';
export interface ICheckBoxMenuItemProps {
    configName: string;
    onInputChange: (payload: PartialConfig) => void;
    warning: JSX.Element;
}

const WarningPopupHandler = React.memo((props: ICheckBoxMenuItemProps) => {
    const [showModal, setShowModal] = useState(true);

    function accept() {
        setShowModal(false);
        props.onInputChange({
            [props.configName]: true,
        });
    }

    function decline() {
        setShowModal(false);
        props.onInputChange({
            [props.configName]: false,
        });
    }

    return (
        <Popup open={showModal} modal={true} closeOnDocumentClick={false}>
            <>
                <h1>Warning!</h1>
                <br />
                {props.warning}
                <br />
                <Button
                    variant="contained"
                    className="accept"
                    color="primary"
                    onClick={accept}
                >
                    Proceed
                </Button>
                <Button
                    variant="contained"
                    className="decline"
                    onClick={decline}
                >
                    Cancel
                </Button>
            </>
        </Popup>
    );
});

export default WarningPopupHandler;
