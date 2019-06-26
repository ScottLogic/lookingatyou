import React from 'react';
export default function TextBoxMenuItem(props: {
    name: string;
    onInputChange: (text: string) => void;
    color: string;
}) {
    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        props.onInputChange(event.target.value);
    }
    return (
        <div>
            <label>{props.name}</label>
            <input type="color" value={props.color} onChange={onChange} />
        </div>
    );
}
