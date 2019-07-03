import React from 'react';

export interface IColorMenuItemProps {
    name: string;
    onInputChange: (text: string) => void;
    color: string;
}

export default function ColorMenuItem(props: IColorMenuItemProps) {
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
