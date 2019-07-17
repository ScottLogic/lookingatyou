import React, { useEffect, useState } from 'react';
import { ISetConfigPayload } from '../../../store/actions/config/types';
import { HelpWith } from '../Help';

export interface ITextBoxMenuItemProps {
    name: string;
    configName: string;
    step: number;
    onValidInput: (payload: ISetConfigPayload) => void;
    defaultValue: number;
    configParse: (text: string) => number;
    helpWith: HelpWith;
}
const TextBoxMenuItem = React.memo(
    (props: ITextBoxMenuItemProps) => {
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
            const newValue = props.configParse(event.target.value);
            setValue(newValue);
            const newIsValid = !isNaN(newValue);
            setIsValid(newIsValid);
            if (newIsValid) {
                setLastValidValue(newValue);
                props.onValidInput({
                    partialConfig: {
                        [props.configName]: newValue,
                    },
                });
            }
        }

        return (
            <div data-tip={true} data-for={HelpWith[props.helpWith]}>
                <label>{props.name}</label>
                <input
                    type="number"
                    value={value || ''}
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

export default TextBoxMenuItem;
