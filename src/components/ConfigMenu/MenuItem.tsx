import React, { Component, ReactNode } from 'react';

interface IMenuItemProps {
    name: string
}

interface ITextBoxMenuItemProps extends IMenuItemProps {
    onInputChange: { (text: string): void }
}
export function TextBoxMenuItem(props: ITextBoxMenuItemProps) {
    var textbox = <input type="textbox" onChange={(event) => props.onInputChange(event.target.value)}></input> as unknown as HTMLInputElement;
    return <InputMenuItemDiv name={props.name}>{textbox}</InputMenuItemDiv>
}

interface ICheckBoxMenuItemProps extends IMenuItemProps {
    onInputChange: { (checked: boolean): void }
}
export function CheckBoxMenuItem(props: ICheckBoxMenuItemProps) {
    var checkbox = <input type="checkbox" onChange={(event) => props.onInputChange(event.target.checked)}></input> as unknown as HTMLInputElement;
    return <InputMenuItemDiv name={props.name}>{checkbox}</InputMenuItemDiv>
}

 
function InputMenuItemDiv(props: { name: string, children: ReactNode}) {
    return (
        <div>
            <label>{props.name}</label>
            {props.children}
        </div>
    );
}