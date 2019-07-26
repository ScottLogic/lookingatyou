import React from 'react';
import './ConfigMenu.css';

export interface IConfigMenuProps {
    width: string;
    timerLength: number;
    children: React.ReactNode;
    window: Window;
    debugEnabled: boolean;
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
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.props.window.addEventListener('mousemove', this.mouseMoveHandler);
    }

    mouseMoveHandler() {
        this.setState({ leftPosition: '0px' });
        clearInterval(this.hideTimeout);
        if (!this.state.isUnderMouse && !this.props.debugEnabled) {
            this.hideTimeout = window.setTimeout(
                () => this.setState({ leftPosition: '-' + this.props.width }),
                this.props.timerLength,
            );
        }
    }

    onMouseEnter() {
        clearInterval(this.hideTimeout);
        this.setState({ isUnderMouse: true });
    }

    onMouseLeave() {
        this.setState({ isUnderMouse: false });
    }

    shouldComponentUpdate(
        nextProps: IConfigMenuProps,
        nextState: IConfigMenuState,
    ) {
        return (
            nextState.leftPosition !== this.state.leftPosition ||
            nextProps.children !== this.props.children ||
            nextProps.width !== this.props.width
        );
    }

    render() {
        return (
            <div
                style={{
                    width: this.props.width,
                    left: this.state.leftPosition,
                }}
                className={'ConfigMenu'}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                {this.props.children}
            </div>
        );
    }
}
