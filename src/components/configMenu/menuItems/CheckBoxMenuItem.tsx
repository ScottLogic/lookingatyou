import { Button, Checkbox } from '@material-ui/core';
import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import { PartialConfig } from '../../../store/actions/config/types';
import { HelpWith } from '../Help';
import './CheckBoxMenuItem.css';

export interface ICheckBoxMenuItemProps {
    alert: boolean;
    name: string;
    configName: string;
    onInputChange: (payload: PartialConfig) => void;
    checked: boolean;
    helpWith: HelpWith;
}

const CheckBoxMenuItem = React.memo(
    (props: ICheckBoxMenuItemProps) => {
        const [showModal, setShowModal] = useState(false);

        function onChange() {
            if (props.alert && !props.checked) {
                setShowModal(true);
            } else {
                props.onInputChange({
                    [props.configName]: !props.checked,
                });
            }
        }

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
            <div data-tip={true} data-for={HelpWith[props.helpWith]}>
                <label>{props.name}</label>

                <Checkbox
                    checked={props.checked}
                    onClick={onChange}
                    color="primary"
                />

                {props.alert && (
                    <Popup
                        open={showModal}
                        modal={true}
                        closeOnDocumentClick={false}
                    >
                        <>
                            <h1>Warning!</h1>
                            <br />
                            The advanced settings are intended for users with a
                            technical understanding of the app and changing them
                            from the defaults could lead to the app becoming
                            unstable.
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
                )}
            </div>
        );
    },
    (previous, next) => previous.checked === next.checked,
);

export default CheckBoxMenuItem;
