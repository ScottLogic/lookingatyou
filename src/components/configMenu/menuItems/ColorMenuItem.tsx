import React from 'react';
import { ISetConfigPayload } from '../../../store/actions/config/types';
import { HelpWith } from '../Help';

export interface IColorMenuItemProps {
    name: string;
    configName: string;
    onInputChange: (payload: ISetConfigPayload) => void;
    color: string;
    helpWith: HelpWith;
}

const ColorMenuItem = React.memo(
    (props: IColorMenuItemProps) => {
        function onChange(event: React.ChangeEvent<HTMLInputElement>) {
            props.onInputChange({
                partialConfig: { [props.configName]: event.target.value },
            });
        }
        return (
            <div data-tip={true} data-for={HelpWith[props.helpWith]}>
                <label>{props.name}</label>
                <input type="color" value={props.color} onChange={onChange} />
            </div>
        );
    },
    (previous, next) =>
        previous.color === next.color && previous.name === next.name,
);
export default ColorMenuItem;
