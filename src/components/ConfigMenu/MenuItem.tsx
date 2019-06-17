import React from 'react';

interface IMenuItemProps {
    name: string
}
interface ITextBoxMenuItemProps extends IMenuItemProps {
    onInputChange: { (text: string): void }
}
interface ICheckBoxMenuItemProps extends IMenuItemProps {
    onInputChange: { (checked: boolean): void }
}

export class TextBoxMenuItem extends React.Component<ITextBoxMenuItemProps> {
    render() {
        var textbox = <input type="textbox" onChange={(event) => this.props.onInputChange(event.target.value)}></input> as unknown as HTMLInputElement;
        return <MenuItemDiv name={this.props.name} input={textbox}></MenuItemDiv>
    }
}

export class CheckBoxMenuItem extends React.Component<ICheckBoxMenuItemProps> {
    render() {
        var checkbox = <input type="checkbox" onChange={(event) => this.props.onInputChange(event.target.checked)}></input> as unknown as HTMLInputElement;
        return <MenuItemDiv name={this.props.name} input={checkbox}></MenuItemDiv>
    }
}

class MenuItemDiv extends React.Component<{ name: string, input: HTMLInputElement }> {
    render() {
        return (
            <div>
                <label>{this.props.name}</label>
                {this.props.input}
            </div>
        ) as unknown as HTMLDivElement;
    }
}