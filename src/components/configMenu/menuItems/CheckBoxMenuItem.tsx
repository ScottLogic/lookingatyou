import React from 'react';
export default function CheckBoxMenuItem(props: {
    name: string;
    onInputChange: (checked: boolean) => void;
    checked: boolean;
}) {
    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        props.onInputChange(event.target.checked);
    }
    return (
        <div>
            <label>{props.name}</label>
            <input
                type="checkbox"
                checked={props.checked}
                onChange={onChange}
            />
        </div>
    );
}
