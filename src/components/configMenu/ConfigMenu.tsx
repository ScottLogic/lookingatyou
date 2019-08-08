import { Button } from '@material-ui/core';
import React from 'react';
import isEqual from 'react-fast-compare';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { configMenuConsts } from '../../AppConstants';
import {
    resetConfigAction,
    updateConfigAction,
} from '../../store/actions/config/actions';
import {
    ConfigSetAction,
    IConfigState,
    PartialConfig,
} from '../../store/actions/config/types';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getConfig } from '../../store/selectors/configSelectors';
import AdvancedConfigItems from './AdvancedConfigItems';
import './ConfigMenu.css';
import Help, { HelpWith } from './Help';
import UserConfigItems from './UserConfigItems';

export interface IConfigMenuProps {
    window: Window;
}

interface IConfigMenuMapStateToProps {
    config: IConfigState;
}

interface IConfigMenuMapDispatchToProps {
    updateAppConfig: (payload: PartialConfig) => void;
    updateModelConfig: (payload: PartialConfig) => void;
    updateDetectionConfig: (payload: PartialConfig) => void;
    resetConfig: () => void;
}

export type ConfigMenuProps = IConfigMenuProps &
    IConfigMenuMapStateToProps &
    IConfigMenuMapDispatchToProps;

interface IConfigMenuState {
    leftPosition: string;
    isUnderMouse: boolean;
}

class ConfigMenu extends React.Component<ConfigMenuProps, IConfigMenuState> {
    private hideTimeout: number = 0;

    constructor(props: ConfigMenuProps) {
        super(props);
        this.state = {
            leftPosition: '0px',
            isUnderMouse: false,
        };
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.props.window.addEventListener('mousemove', this.mouseMoveHandler);
    }

    mouseMoveHandler() {
        this.setState({ leftPosition: '0px' });
        this.props.window.clearInterval(this.hideTimeout);
        if (
            !this.state.isUnderMouse &&
            !this.props.config.advancedConfig.toggleDebug
        ) {
            this.hideTimeout = this.props.window.setTimeout(
                () =>
                    this.setState({
                        leftPosition: '-' + configMenuConsts.width,
                    }),
                configMenuConsts.visibleTimer,
            );
        }
    }

    onMouseEnter() {
        this.props.window.clearInterval(this.hideTimeout);
        this.setState({ isUnderMouse: true });
    }

    onMouseLeave() {
        this.setState({ isUnderMouse: false });
    }

    shouldComponentUpdate(
        nextProps: ConfigMenuProps,
        nextState: IConfigMenuState,
    ) {
        return (
            nextState.leftPosition !== this.state.leftPosition ||
            !isEqual(nextProps, this.props)
        );
    }

    componentWillUnmount() {
        this.props.window.clearInterval(this.hideTimeout);
        this.props.window.removeEventListener(
            'mousemove',
            this.mouseMoveHandler,
        );
    }

    render() {
        return (
            <div
                style={{
                    left: this.state.leftPosition,
                    width: configMenuConsts.width,
                }}
                className={'ConfigMenu'}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                <h1>Settings</h1>
                <span
                    className="icon"
                    data-tip={true}
                    data-for={HelpWith[HelpWith.APP]}
                >
                    ?
                </span>
                <UserConfigItems {...this.props} />
                {this.props.config.appConfig.toggleAdvanced && (
                    <AdvancedConfigItems {...this.props} />
                )}

                <br />

                <Button
                    variant="contained"
                    className="reset"
                    onClick={this.props.resetConfig}
                >
                    RESET TO DEFAULTS
                </Button>

                <br />

                {Object.values(HelpWith).map((type, key: number) => (
                    <Help key={key} problemWith={HelpWith[type] as HelpWith} />
                ))}
            </div>
        );
    }
}
const mapStateToProps = (state: IRootStore): IConfigMenuMapStateToProps => ({
    config: getConfig(state),
});

const mapDispatchToProps = (
    dispatch: ThunkDispatch<IRootStore, void, Action>,
    ownProps: IConfigMenuProps,
) => ({
    updateAppConfig: (payload: PartialConfig) =>
        dispatch(
            updateConfigAction(
                ConfigSetAction.APP,
                payload,
                ownProps.window.document,
            ),
        ),
    updateModelConfig: (payload: PartialConfig) =>
        dispatch(
            updateConfigAction(
                ConfigSetAction.MODEL,
                payload,
                ownProps.window.document,
            ),
        ),
    updateDetectionConfig: (payload: PartialConfig) =>
        dispatch(
            updateConfigAction(
                ConfigSetAction.DETECTION,
                payload,
                ownProps.window.document,
            ),
        ),
    resetConfig: () => dispatch(resetConfigAction(ConfigSetAction.RESET)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ConfigMenu);
