import React from 'react';
import './ConfigMenu.css';
import { TextBoxMenuItem, CheckBoxMenuItem } from './MenuItem'

interface IConfigMenuProps {
    width: string,
    timerLength: number
}
interface IConfigMenuState {
    left: string
}
export class ConfigMenu extends React.Component<IConfigMenuProps, IConfigMenuState> {
    static className: string = "ConfigMenu";

    constructor(props: IConfigMenuProps) {
        super(props);
        this.state = { left: "0" };
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        document.onmousemove = this.show;
    }

    private isUnderMouse: boolean = false;
    private timeout: number = window.setTimeout(() => { }, 0);
    show() {
        this.setState({ left: "0px" });
        clearInterval(this.timeout);
        if (!this.isUnderMouse)
            this.timeout = window.setTimeout(this.hide, this.props.timerLength);
    }
    hide() {
        this.setState({ left: "-" + this.props.width });
    }

    render() {
        return (
            <div
                style={{ width: this.props.width, left: this.state.left }}
                className={ConfigMenu.className}
                onMouseMove={() => { this.isUnderMouse = true }}
                onMouseLeave={() => { this.isUnderMouse = false }}
            > <h1>Config</h1>
                {this.props.children}
            </div>
        );
    }
}
export function example(): React.Component {
    return (
        <ConfigMenu width="14em" timerLength={1000}>
            <TextBoxMenuItem name="textbox" onInputChange={((text: string) => alert("Text: " + text))}></TextBoxMenuItem>
            <CheckBoxMenuItem name="checkbox" onInputChange={((checked: boolean) => alert("Checked: " + checked))}></CheckBoxMenuItem>
        </ConfigMenu>
    ) as unknown as React.Component;
}