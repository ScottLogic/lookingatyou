import React from 'react';
import { ISetConfigPayload } from '../../../store/actions/config/types';
import { HelpWith } from '../Help';

export interface ICheckBoxMenuItemProps {
    name: string;
    configName: string;
    onInputChange: (payload: ISetConfigPayload) => void;
    checked: boolean;
    helpWith: HelpWith;
}

const CheckBoxMenuItem = React.memo(
    (props: ICheckBoxMenuItemProps) => {
        function onChange(event: React.ChangeEvent<HTMLInputElement>) {
            props.onInputChange({
                partialConfig: { [props.configName]: event.target.checked },
            });
        }
        return (
            <div data-tip={true} data-for={HelpWith[props.helpWith]}>
                <label>{props.name}</label>
                <input
                    type="checkbox"
                    checked={props.checked}
                    onChange={onChange}
                />
            </div>
        );
    },
    (previous, next) => previous.checked === next.checked,
);

export default CheckBoxMenuItem;
