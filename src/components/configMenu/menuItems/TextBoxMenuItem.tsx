import React, { useState } from 'react';

interface ITextBoxMenuItemProps {
    name: string;
    isValidInput: (text: string) => boolean;
    onValidInput: (text: string) => void;
    defaultValue: string;
    parse: (text: string) => string;
}
export default function TextBoxMenuItem(props: ITextBoxMenuItemProps) {
    const [isValid, setIsValid] = useState(true);
    const [value, setValue] = useState(props.defaultValue);
    const [lastValidValue, setLastValidValue] = useState(props.defaultValue);
    function onBlur(event: React.FocusEvent<HTMLInputElement>) {
        setValue(props.parse(lastValidValue));
        setIsValid(true);
    }
    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newValue = event.target.value;
        setValue(newValue);
        const newIsValid = props.isValidInput(event.target.value);
        setIsValid(newIsValid);
        if (newIsValid) {
            setLastValidValue(newValue);
            props.onValidInput(newValue);
        }
    }
    return (
        <div>
            <label>{props.name}</label>
            <input
                type="textbox"
                value={value}
                style={{
                    color: isValid ? 'black' : 'red',
                }}
                onBlur={onBlur}
                onChange={onChange}
            />
        </div>
    );
}
