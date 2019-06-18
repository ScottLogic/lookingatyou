import React from 'react';
import './ConfigMenu.css';
import { TextBoxMenuItem, CheckBoxMenuItem } from './MenuItem'

interface IConfigMenuProps {
    width: string,
    timerLength: number
}
interface IConfigMenuState {
    leftPosition: string
}
export class ConfigMenu extends React.Component<IConfigMenuProps, IConfigMenuState> {
    private isUnderMouse: boolean = false;
    private timeout: number = window.setTimeout(() => { }, 0);
    constructor(props: IConfigMenuProps) {
        super(props);
        this.state = { leftPosition: "0px" };
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        document.onmousemove = this.show;
    }
    
    show() {
        clearInterval(this.timeout);
        if (!this.isUnderMouse)
            this.timeout = window.setTimeout(this.hide, this.props.timerLength);
        this.setState({ leftPosition: "0px" });
    }
    hide() {
        this.setState({ leftPosition: "-" + this.props.width });
    }

    render() {
        return (
            <div
                style={{ width: this.props.width, left: this.state.leftPosition }}
                className={"ConfigMenu"}
                onMouseMove={() => { this.isUnderMouse = true }}
                onMouseLeave={() => { this.isUnderMouse = false }}
            > <h1>Config</h1>
                {this.props.children}
            </div>
        );
    }
}
export function Example() {
    return (
        <ConfigMenu width="14em" timerLength={1000}>
            <TextBoxMenuItem name="textbox" onInputChange={((text: string) => alert("Text: " + text))}/>
            <CheckBoxMenuItem name="checkbox" onInputChange={((checked: boolean) => alert("Checked: " + checked))}/>
        </ConfigMenu>
    );
}