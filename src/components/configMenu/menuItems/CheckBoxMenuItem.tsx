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

        function onChange(event: React.ChangeEvent<HTMLInputElement>) {
            if (props.warning && !props.checked) {
                setShowModal(true);
            } else {
                props.onInputChange({
                    [props.configName]: event.target.checked,
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

        return (
            <div data-tip={true} data-for={HelpWith[props.helpWith]}>
                <label>{props.name}</label>

                <input
                    type="checkbox"
                    checked={props.checked}
                    onChange={onChange}
                />

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
            </div>
        );
    },
    (previous, next) => previous.checked === next.checked,
);

export default CheckBoxMenuItem;
