import React from 'react';
import { HelpWith } from '../Help';

export interface ICheckBoxMenuItemProps {
    name: string;
    onInputChange: (checked: boolean) => void;
    checked: boolean;
    helpWith: HelpWith;
}

const CheckBoxMenuItem = React.memo(
    (props: ICheckBoxMenuItemProps) => {
        function onChange(event: React.ChangeEvent<HTMLInputElement>) {
            props.onInputChange(event.target.checked);
        }
        return (
            <p data-tip={true} data-for={HelpWith[props.helpWith]}>
                <div>
                    <label>{props.name}</label>
                    <input
                        type="checkbox"
                        checked={props.checked}
                        onChange={onChange}
                    />
                </div>
            </p>
        );
    },
    (previous, next) =>
        previous.checked === next.checked && previous.name === next.name,
);
export default CheckBoxMenuItem;
