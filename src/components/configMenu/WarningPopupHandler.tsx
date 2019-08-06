import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import { PartialConfig } from '../../store/actions/config/types';
import './menuItems/CheckBoxMenuItem.css';
export interface ICheckBoxMenuItemProps {
    configName: string;
    onInputChange: (payload: PartialConfig) => void;
    checked: boolean;
    warning: JSX.Element;
}

const WarningPopupHandler = React.memo(
    (props: ICheckBoxMenuItemProps) => {
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
    },
    (previous, next) => previous.checked === next.checked,
);

export default WarningPopupHandler;
