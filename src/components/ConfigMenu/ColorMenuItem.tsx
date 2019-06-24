import React from 'react';
export default function TextBoxMenuItem(props: {name : string, onInputChange: { (text: string): void }, color: string }) {
    return (
        <div>
            <label>{props.name}</label>
            <input type="color" value={props.color} onChange={(event) => { props.onInputChange(event.target.value) }}></input>
        </div>
    )
}