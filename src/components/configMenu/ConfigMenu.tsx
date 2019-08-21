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
    IAdvancedConfig,
    IAppConfig,
    PartialConfig,
    UpdateConfigAction,
} from '../../store/actions/config/types';
import { IRootStore } from '../../store/reducers/rootReducer';
import {
    getAdvancedConfig,
    getAppConfig,
} from '../../store/selectors/configSelectors';
import AdvancedConfigItems from './AdvancedConfigItems';
import './ConfigMenu.css';
import Help, { appHelp, HelpWith } from './Help';
import ColorPopup from './menuItems/ColorPopup';
import UserConfigItems from './UserConfigItems';

export interface IConfigMenuProps {
    window: Window;
}

interface IConfigMenuMapStateToProps {
    appConfig: IAppConfig;
    advancedConfig: IAdvancedConfig;
}

interface IConfigMenuMapDispatchToProps {
    updateAppConfig: UpdateConfigAction;
    updateModelConfig: UpdateConfigAction;
    updateDetectionConfig: UpdateConfigAction;
    updateAdvancedConfig: UpdateConfigAction;
    resetConfig: () => void;
}

export type ConfigMenuProps = IConfigMenuProps &
    IConfigMenuMapStateToProps &
    IConfigMenuMapDispatchToProps;

interface IConfigMenuState {
    leftPosition: string;
    isUnderMouse: boolean;
    showColorPopup: boolean;
}

export class ConfigMenu extends React.Component<
    ConfigMenuProps,
    IConfigMenuState
> {
    private hideTimeout: number = 0;

    constructor(props: ConfigMenuProps) {
        super(props);
        this.state = {
            leftPosition: '0px',
            isUnderMouse: false,
            showColorPopup: false,
        };
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.toggleShowColorPopup = this.toggleShowColorPopup.bind(this);
        this.props.window.addEventListener('mousemove', this.mouseMoveHandler);
    }

    mouseMoveHandler() {
        this.setState({ leftPosition: '0px' });
        this.props.window.document.body.style.cursor = 'default';
        this.props.window.clearInterval(this.hideTimeout);

        if (
            !this.state.isUnderMouse &&
            (!this.props.advancedConfig.toggleDebug ||
                !this.props.appConfig.toggleAdvanced)
        ) {
            this.hideTimeout = this.props.window.setTimeout(() => {
                this.setState({
                    leftPosition: configMenuConsts.leftPos,
                });
                this.props.window.document.body.style.cursor = 'none';
            }, configMenuConsts.visibleTimer);
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
            this.state.showColorPopup !== nextState.showColorPopup ||
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

    toggleShowColorPopup() {
        this.setState({
            showColorPopup: !this.state.showColorPopup,
        });
    }

    render() {
        const showAppHelp = () => {
            this.props.updateAppConfig({ showHelp: true });
        };
        return (
            <>
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
                    <Button
                        variant="contained"
                        className="icon"
                        onClick={showAppHelp}
                    >
                        Help
                    </Button>

                    <UserConfigItems
                        {...this.props}
                        colorPopupOnClick={this.toggleShowColorPopup}
                    />

                    {this.props.appConfig.toggleAdvanced && (
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
                    <br />
                </div>

                {Object.values(HelpWith).map((type, key: number) => {
                    const showHelp =
                        this.props.appConfig.toggleAdvanced ||
                        appHelp.includes(type);
                    return (
                        showHelp && (
                            <Help
                                key={key}
                                problemWith={HelpWith[type] as HelpWith}
                            />
                        )
                    );
                })}

                {this.state.showColorPopup && (
                    <ColorPopup
                        showPopup={this.state.showColorPopup}
                        color={this.props.appConfig.irisColor}
                        configName={'irisColor'}
                        close={this.toggleShowColorPopup}
                        onInputChange={this.props.updateAppConfig}
                    />
                )}
            </>
        );
    }
}
const mapStateToProps = (state: IRootStore): IConfigMenuMapStateToProps => ({
    appConfig: getAppConfig(state),
    advancedConfig: getAdvancedConfig(state),
});

const mapDispatchToProps = (
    dispatch: ThunkDispatch<IRootStore, void, Action>,
    ownProps: IConfigMenuProps,
) => ({
    updateAppConfig: (payload: PartialConfig) =>
        dispatch(
            updateConfigAction(ConfigSetAction.APP, payload, ownProps.window),
        ),
    updateAdvancedConfig: (payload: PartialConfig) =>
        dispatch(
            updateConfigAction(
                ConfigSetAction.ADVANCED,
                payload,
                ownProps.window,
            ),
        ),
    updateModelConfig: (payload: PartialConfig) =>
        dispatch(
            updateConfigAction(ConfigSetAction.MODEL, payload, ownProps.window),
        ),
    updateDetectionConfig: (payload: PartialConfig) =>
        dispatch(
            updateConfigAction(
                ConfigSetAction.DETECTION,
                payload,
                ownProps.window,
            ),
        ),
    resetConfig: () => dispatch(resetConfigAction(ConfigSetAction.RESET)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ConfigMenu);
