import React from 'react';

export interface IColorMenuItemProps {
    name: string;
    onInputChange: (text: string) => void;
    color: string;
}

const ColorMenuItem = React.memo(
    (props: IColorMenuItemProps) => {
        function onChange(event: React.ChangeEvent<HTMLInputElement>) {
            props.onInputChange(event.target.value);
        }
        return (
            <div>
                <label>{props.name}</label>
                <input type="color" value={props.color} onChange={onChange} />
            </div>
        );
    },
    (previous, next) =>
        previous.color === next.color && previous.name === next.name,
);
export default ColorMenuItem;
