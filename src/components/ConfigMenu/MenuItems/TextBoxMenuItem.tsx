import React, { useState } from 'react';
interface ITextBoxMenuItemProps {
    name: string,
    isValidInput: { (text: string): boolean },
    onValidInput: { (text: string): void },
    defaultValue: string,
    parse: { (text: string): string }
}
export default function TextBoxMenuItem(props: ITextBoxMenuItemProps) {
    const [isValid, setIsValid] = useState(true);
    const [value, setValue] = useState(props.defaultValue);
    const [lastValidValue, setLastValidValue] = useState(props.defaultValue);
    return (
        <div>
            <label>{props.name}</label>
            <input type="textbox" value={value} style={{ color: isValid ? "black" : "red" }}
                onBlur={(event) => {
                    setValue(props.parse(lastValidValue));
                    setIsValid(true);
                }}
                onChange={(event) => {
                    var value = event.target.value;
                    setValue(value);
                    var isValid = props.isValidInput(event.target.value);
                    setIsValid(isValid);
                    if (isValid) {
                        setLastValidValue(value);
                        props.onValidInput(value)
                    }
                }}></input>
        </div>
    )
}