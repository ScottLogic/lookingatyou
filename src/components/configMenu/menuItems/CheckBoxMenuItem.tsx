/* tslint:disable:jsx-no-lambda */

import React from 'react';
export default function CheckBoxMenuItem(props: {
    name: string;
    onInputChange: (checked: boolean) => void;
    checked: boolean;
}) {
    return (
        <div>
            <label>{props.name}</label>
            <input
                type="checkbox"
                checked={props.checked}
                onChange={event => {
                    props.onInputChange(event.target.checked);
                }}
            />
        </div>
    );
}
