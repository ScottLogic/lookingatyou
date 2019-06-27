import React from 'react';
import './ConfigMenu.css';

interface IConfigMenuProps {
    width: string;
    timerLength: number;
    children: React.ReactNode;
}
interface IConfigMenuState {
    leftPosition: string;
    isUnderMouse: boolean;
}

export default class ConfigMenu extends React.Component<
    IConfigMenuProps,
    IConfigMenuState
> {
    private hideTimeout: number = 0;
    constructor(props: IConfigMenuProps) {
        super(props);
        this.state = { leftPosition: '0px', isUnderMouse: false };
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        window.addEventListener('mousemove', () => {
            this.setState({ leftPosition: '0px' });
            clearInterval(this.hideTimeout);
            if (!this.state.isUnderMouse) {
                this.hideTimeout = window.setTimeout(
                    () => this.setState({ leftPosition: '-' + props.width }),
                    props.timerLength,
                );
            }
        });
    }
    onMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        clearInterval(this.hideTimeout);
        this.setState({ isUnderMouse: true });
    }
    onMouseLeave(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        this.setState({ isUnderMouse: false });
    }
    render() {
        return (
            <div
                style={{
                    width: this.props.width,
                    left: this.state.leftPosition,
                }}
                className={'ConfigMenu'}
                onMouseMove={this.onMouseMove}
                onMouseLeave={this.onMouseLeave}
            >
                {' '}
                <h1>Config</h1>
                {this.props.children}
            </div>
        );
    }
}
