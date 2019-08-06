import { Checkbox, FormControl, FormControlLabel } from '@material-ui/core';
import React, { useState } from 'react';
import { PartialConfig } from '../../../store/actions/config/types';
import { HelpWith } from '../Help';
import WarningPopupHandler from '../WarningPopupHandler';

export interface ICheckBoxMenuItemProps {
    name: string;
    configName: string;
    onInputChange: (payload: PartialConfig) => void;
    checked: boolean;
    helpWith: HelpWith;
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

        return (
            <div
                className="checkbox"
                data-tip={true}
                data-for={HelpWith[props.helpWith]}
            >
                <FormControl>
                    <FormControlLabel
                        value="start"
                        onChange={onChange}
                        control={
                            <Checkbox checked={props.checked} color="primary" />
                        }
                        label={props.name}
                        labelPlacement="start"
                    />
                </FormControl>
                {showModal && props.warning && (
                    <WarningPopupHandler
                        configName={props.configName}
                        onInputChange={props.onInputChange}
                        warning={props.warning}
                    />
                )}
            </div>
        );
    },
    (previous, next) => previous.checked === next.checked,
);

export default CheckBoxMenuItem;
