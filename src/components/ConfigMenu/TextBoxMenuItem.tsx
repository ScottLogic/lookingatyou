import React from 'react';
export default function TextBoxMenuItem(props: {name : string, onInputChange: { (text: string): void }, value: string }) {
    return (
        <div>
            <label>{props.name}</label>
            <input type="textbox" value={props.value} onChange={(event) => { props.onInputChange(event.target.value) }}></input>
        </div>
    )
}