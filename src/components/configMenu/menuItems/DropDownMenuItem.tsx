import { FormControl, MenuItem, Select } from '@material-ui/core';
import React from 'react';
import { UpdateConfigAction } from '../../../store/actions/config/types';
import { HelpWith } from '../Help';

export interface IDropDownMenuItemProps {
    name: string;
    configName: string;
    onInputChange: UpdateConfigAction;
    values: string[];
    defaultValue: string;
    helpWith: HelpWith;
}

const DropDownMenuItem = React.memo(
    (props: IDropDownMenuItemProps) => {
        function getMenuItems(): JSX.Element[] {
            const menuItem = props.values.map((element, index) => (
                <MenuItem key={index} value={element}>
                    {element}
                </MenuItem>
            ));
            return menuItem;
        }

        function handleChange(event: any) {
            props.onInputChange({
                [props.configName]: event.target.value,
            });
        }

        return (
            <div data-tip={true} data-for={HelpWith[props.helpWith]}>
                <label>{props.name}</label>
                <FormControl className="selectForm">
                    <Select
                        value={props.defaultValue}
                        onChange={handleChange}
                        name={props.name}
                    >
                        {getMenuItems()}
                    </Select>
                </FormControl>
            </div>
        );
    },
    (previous, next) =>
        previous.defaultValue === next.defaultValue &&
        previous.values.length === next.values.length &&
        previous.values.every(
            (element, index) => element === next.values[index],
        ),
);

export default DropDownMenuItem;
