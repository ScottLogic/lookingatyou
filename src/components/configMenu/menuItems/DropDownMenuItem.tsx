import React from 'react';
import { ISetConfigPayload } from '../../../store/actions/config/types';
import { HelpWith } from '../Help';

export interface IDropDownMenuItemProps {
    name: string;
    configName: string;
    onInputChange: (payload: ISetConfigPayload) => void;
    values: string[];
    defaultValue: string;
    helpWith: HelpWith;
}

const DropDownMenuItem = React.memo(
    (props: IDropDownMenuItemProps) => {
        function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
            props.onInputChange({
                partialConfig: { [props.configName]: event.target.value },
            });
        }

        return (
            <div data-tip={true} data-for={HelpWith[props.helpWith]}>
                <label>{props.name}</label>
                <select onChange={onChange} value={props.defaultValue}>
                    {props.values.map((value, index) => (
                        <option value={1} key={index}>
                            {value}
                        </option>
                    ))}
                </select>
            </div>
        );
    },
    (previous, next) => previous.defaultValue === next.defaultValue,
);

export default DropDownMenuItem;
