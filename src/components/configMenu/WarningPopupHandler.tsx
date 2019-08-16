import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { UpdateConfigAction } from '../../store/actions/config/types';
import './WarningPopupHandler.css';
export interface ICheckBoxMenuItemProps {
    configName: string;
    onInputChange: UpdateConfigAction;
    showModal: boolean;
    warning: JSX.Element;
    accept: () => void;
    decline: () => void;
}

const WarningPopupHandler = React.memo((props: ICheckBoxMenuItemProps) => {
    const [showModal, setShowModal] = useState(props.showModal);

    useEffect(() => {
        setShowModal(props.showModal);
    }, [setShowModal, props.showModal]);

    return (
        <>
            {showModal && (
                <Popup 
                    open={true} 
                    modal={true} 
                    closeOnDocumentClick={false} 
                    closeOnEscape={false}
                > 
                    <>
                        <h1>Warning!</h1>
                        <br />
                        {props.warning}
                        <br />
                        <Button
                            variant="contained"
                            className="accept"
                            color="primary"
                            onClick={props.accept}
                        >
                            Proceed
                        </Button>
                        <Button
                            variant="contained"
                            className="decline"
                            onClick={props.decline}
                        >
                            Cancel
                        </Button>
                    </>
                </Popup>
            )}
        </>
    );
});

export default WarningPopupHandler;
