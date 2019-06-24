import React, { useState, useEffect } from 'react';
interface ITextBoxMenuItemProps {name: string, 
    isValidInput: { (text: string): boolean }, 
    onValidInput: { (text: string): void }, 
    value: string }
export default function TextBoxMenuItem(props: ITextBoxMenuItemProps) {
    const [isValid, setIsValid] = useState(true);
    return (
        <div>
            <label>{props.name}</label>
            <input type="textbox" defaultValue={props.value} style={{color : isValid ? "black" : "red"}} onChange={(event) => {
                var isValid = props.isValidInput(event.target.value);
                setIsValid(isValid);
                if (isValid)
                    props.onValidInput(event.target.value)
            }}></input>
        </div>
    )
}