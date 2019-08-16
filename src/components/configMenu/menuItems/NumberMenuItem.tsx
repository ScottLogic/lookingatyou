import { TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { UpdateConfigAction } from '../../../store/actions/config/types';
import { HelpWith } from '../Help';

export interface INumberMenuItemProps {
    configName: string;
    defaultValue: number;
    helpWith: HelpWith;
    name: string;
    step: number;
    onValidInput: (payload: PartialConfig) => void;
    max?: number;
    min?: number;
    noDecimals?: boolean;
}
const NumberMenuItem = React.memo(
    (props: INumberMenuItemProps) => {
        const [isValid, setIsValid] = useState(true);
        const [value, setValue] = useState(props.defaultValue);
        const [lastValidValue, setLastValidValue] = useState(
            props.defaultValue,
        );
        useEffect(() => {
            setValue(props.defaultValue);
        }, [props.defaultValue, setValue]);

        function onBlur() {
            setValue(lastValidValue);
            setIsValid(true);
        }

        function onChange(event: React.ChangeEvent<HTMLInputElement>) {
            const newValue = Number(event.target.value);
            setValue(newValue);

            const isAllowDecimalValid =
                !props.noDecimals || Number.isInteger(newValue);

            const newIsValid =
                isAllowDecimalValid &&
                !isNaN(newValue) &&
                (!props.min || newValue >= props.min) &&
                (!props.max || newValue <= props.max);

            setIsValid(newIsValid);
            if (newIsValid) {
                setLastValidValue(newValue);
                props.onValidInput({
                    [props.configName]: newValue,
                });
            }
        }

        return (
            <div data-tip={true} data-for={HelpWith[props.helpWith]}>
                <label>{props.name}</label>
                <TextField
                    className="textFieldInput"
                    id="standard-number"
                    value={value || 0}
                    onChange={onChange}
                    onBlur={onBlur}
                    type="number"
                    error={!isValid}
                    margin="normal"
                />
            </div>
        );
    },
    (previous, next) =>
        previous.name === next.name &&
        previous.defaultValue === next.defaultValue,
);
export default NumberMenuItem;
