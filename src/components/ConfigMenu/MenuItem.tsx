import React from 'react';

interface IMenuItemProps {
    name: string
}

interface ITextBoxMenuItemProps extends IMenuItemProps {
    onInputChange: { (text: string): void }
}
export class TextBoxMenuItem extends React.Component<ITextBoxMenuItemProps> {
    render() {
        var textbox = <input type="textbox" onChange={(event) => this.props.onInputChange(event.target.value)}></input> as unknown as HTMLInputElement;
        return <InputMenuItemDiv name={this.props.name} input={textbox} />
    }
}

interface ICheckBoxMenuItemProps extends IMenuItemProps {
    onInputChange: { (checked: boolean): void }
}
export class CheckBoxMenuItem extends React.Component<ICheckBoxMenuItemProps> {
    render() {
        var checkbox = <input type="checkbox" onChange={(event) => this.props.onInputChange(event.target.checked)}></input> as unknown as HTMLInputElement;
        return <InputMenuItemDiv name={this.props.name} input={checkbox} />
    }
}

class InputMenuItemDiv extends React.Component<{ name: string, input: HTMLInputElement }> {
    render() {
        return (
            <div>
                <label>{this.props.name}</label>
                {this.props.input}
            </div>
        ) as unknown as HTMLDivElement;
    }
}

interface ICanvasMenuItemProps extends IMenuItemProps {
    canvas: HTMLCanvasElement
}
/*
export class CanvasMenuItem extends React.Component<ICanvasMenuItemProps> {
    render() {
        return (
            <div>
                <label>{this.props.name}</label>
                <br/>
                {this.props.canvas}
            </div>
        )
    }
}
*/