import { Checkbox, FormControl, FormControlLabel } from '@material-ui/core';
import React, { useState } from 'react';
import { UpdateConfigAction } from '../../../store/actions/config/types';
import { HelpWith } from '../Help';
import WarningPopupHandler from '../WarningPopupHandler';

export interface ICheckBoxMenuItemProps {
    name: string;
    configName: string;
    onInputChange: UpdateConfigAction;
    checked: boolean;
    helpWith?: HelpWith;
    warning?: JSX.Element;
}

const CheckBoxMenuItem = React.memo(
    (props: ICheckBoxMenuItemProps) => {
        const [showModal, setShowModal] = useState(false);

        function onChange(event: object, checked: boolean) {
            if (props.warning && !props.checked) {
                setShowModal(true);
            } else {
                setShowModal(false);
                props.onInputChange({
                    [props.configName]: checked,
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
        }

        function checkBox(): JSX.Element {
            return (
                <>
                    <FormControl>
                        <FormControlLabel
                            value="start"
                            onChange={onChange}
                            control={
                                <Checkbox
                                    checked={props.checked}
                                    color="primary"
                                />
                            }
                            label={props.name}
                            labelPlacement="start"
                        />
                    </FormControl>

                    {props.warning && (
                        <WarningPopupHandler
                            configName={props.configName}
                            onInputChange={props.onInputChange}
                            showModal={showModal}
                            warning={props.warning}
                            accept={accept}
                            decline={decline}
                        />
                    )}
                </>
            );
        }

        return (
            <>
                {props.helpWith ? (
                    <div
                        className="checkbox"
                        data-tip={true}
                        data-for={HelpWith[props.helpWith]}
                    >
                        {checkBox()}
                    </div>
                ) : (
                    <div className="checkbox"> {checkBox()} </div>
                )}
            </>
        );
    },
    (previous, next) => previous.checked === next.checked,
);

export default CheckBoxMenuItem;
