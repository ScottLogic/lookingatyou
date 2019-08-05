import React from 'react';
import Popup from 'reactjs-popup';
import { PartialConfig } from '../../../store/actions/config/types';
import { HelpWith } from '../Help';

export interface ICheckBoxMenuItemProps {
    window: Window;
    alert: boolean;
    name: string;
    configName: string;
    onInputChange: (payload: PartialConfig) => void;
    checked: boolean;
    helpWith: HelpWith;
}

const CheckBoxMenuItem = React.memo(
    (props: ICheckBoxMenuItemProps) => {
        function onChange(event: React.ChangeEvent<HTMLInputElement>) {
            if (
                props.alert &&
                !props.window.confirm(
                    'WARNING: Changing these settings could result in bad performance of the app',
                )
            ) {
                return;
            }
            props.onInputChange({
                [props.configName]: event.target.checked,
            });
        }
        return (
            <div data-tip={true} data-for={HelpWith[props.helpWith]}>
                <label>{props.name}</label>
                <Popup
                    trigger={
                        <input
                            type="checkbox"
                            checked={props.checked}
                            onChange={onChange}
                        />
                    }
                    position="right center"
                >
                    <div>Popup content here !!</div>
                </Popup>
            </div>
        );
    },
    (previous, next) => previous.checked === next.checked,
);

export default CheckBoxMenuItem;
