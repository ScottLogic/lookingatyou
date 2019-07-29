import React, { useEffect, useState } from 'react';
import { PartialConfig } from '../../../store/actions/config/types';
import { HelpWith } from '../Help';

export interface INumberMenuItemProps {
    name: string;
    configName: string;
    step: number;
    min?: number;
    max?: number;
    onValidInput: (payload: PartialConfig) => void;
    defaultValue: number;
    helpWith: HelpWith;
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
            const newIsValid =
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
                <input
                    type="number"
                    value={value || 0}
                    min={props.min}
                    max={props.max}
                    style={{
                        color: isValid ? 'black' : 'red',
                    }}
                    onBlur={onBlur}
                    onChange={onChange}
                    step={props.step}
                />
            </div>
        );
    },
    (previous, next) =>
        previous.name === next.name &&
        previous.defaultValue === next.defaultValue,
);
export default NumberMenuItem;
