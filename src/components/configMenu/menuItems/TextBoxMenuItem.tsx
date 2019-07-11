import React, { useEffect, useState } from 'react';
import { ISetConfigPayload } from '../../../store/actions/config/types';
import { HelpWith } from '../Help';

export interface ITextBoxMenuItemProps {
    name: string;
    configName: string;
    validRegex: RegExp;
    onValidInput: (payload: ISetConfigPayload) => void;
    defaultValue: string;
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
            const newValue = event.target.value;
            setValue(newValue);
            const newIsValid = props.validRegex.test(newValue);
            setIsValid(newIsValid);
            if (newIsValid) {
                setLastValidValue(newValue);
                props.onValidInput({
                    partialConfig: {
                        [props.configName]: props.configParse(newValue),
                    },
                });
            }
        }

        return (
            <div data-tip={true} data-for={HelpWith[props.helpWith]}>
                <label>{props.name}</label>
                <input
                    type="textbox"
                    value={value || ''}
                    style={{
                        color: isValid ? 'black' : 'red',
                    }}
                    onBlur={onBlur}
                    onChange={onChange}
                />
            </div>
        );
    },
    (previous, next) =>
        previous.name === next.name &&
        previous.defaultValue === next.defaultValue,
);
export default TextBoxMenuItem;
