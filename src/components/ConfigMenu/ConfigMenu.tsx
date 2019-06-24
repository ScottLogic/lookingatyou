import React from 'react';
import './ConfigMenu.css';

interface IConfigMenuProps {
    width: string,
    timerLength: number,
    children: React.ReactNode
}
interface IConfigMenuState {
    leftPosition: string,
    isUnderMouse: boolean
}

export class ConfigMenu extends React.Component<IConfigMenuProps, IConfigMenuState> {
    private hideTimeout: number = 0;
    constructor(props: IConfigMenuProps) {
        super(props);
        this.state = { leftPosition: "0px", isUnderMouse: false };
        window.addEventListener("mousemove", () => {
            this.setState({ leftPosition: "0px" });
            clearInterval(this.hideTimeout);
            if (!this.state.isUnderMouse)
                this.hideTimeout = window.setTimeout(() => this.setState({ leftPosition: "-" + props.width }), props.timerLength);
        });
    }
    render() {
        return (
            <div
                style={{ width: this.props.width, left: this.state.leftPosition }}
                className={"ConfigMenu"}
                onMouseMove={() => { clearInterval(this.hideTimeout); this.setState({ isUnderMouse: true }); }}
                onMouseLeave={() => { this.setState({ isUnderMouse: false }) }}
            > <h1>Config</h1>
                {this.props.children}
            </div>
        );
    }
}