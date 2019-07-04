import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    ISetConfigPayload,
    UPDATE_CONFIG,
} from '../../store/actions/config/types';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getConfig } from '../../store/selectors/configSelectors';
import ConfigMenu from './ConfigMenu';
import IUserConfig from './IUserConfig';
import CanvasMenuItem from './menuItems/CanvasMenuItem';
import CheckBoxMenuItem from './menuItems/CheckBoxMenuItem';
import ColorMenuItem from './menuItems/ColorMenuItem';
import TextBoxMenuItem from './menuItems/TextBoxMenuItem';

export interface IConfigMenuElementProps {
    window: Window;
}

interface IConfigMenuElementMapStateToProps {
    config: IUserConfig;
}
const mapStateToProps = (
    state: IRootStore,
): IConfigMenuElementMapStateToProps => {
    return {
        config: getConfig(state),
    };
};

interface IConfigMenuElementMapDispatchToProps {
    setConfig: (payload: ISetConfigPayload) => void;
}
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setConfig: (payload: ISetConfigPayload) =>
            dispatch({ type: UPDATE_CONFIG, payload }),
    };
};

export type ConfigMenuElementProps = IConfigMenuElementProps &
    IConfigMenuElementMapStateToProps &
    IConfigMenuElementMapDispatchToProps;

export const ConfigMenuElement = React.memo(
    (props: ConfigMenuElementProps) => {
        function parseAndStoreXSensitivity(xSensitivity: string) {
            props.setConfig({
                partialConfig: { xSensitivity: parseFloat(xSensitivity) },
            });
        }
        function parseAndStoreYSensitivity(ySensitivity: string) {
            props.setConfig({
                partialConfig: { ySensitivity: parseFloat(ySensitivity) },
            });
        }
        function parseAndStoreFPS(fps: string) {
            props.setConfig({ partialConfig: { fps: parseInt(fps, 10) } });
        }
        function storeSwapEyes(swapEyes: boolean) {
            props.setConfig({ partialConfig: { swapEyes } });
        }
        function storeToggleDebug(toggleDebug: boolean) {
            props.setConfig({ partialConfig: { toggleDebug } });
        }
        function storeIrisColor(irisColor: string) {
            props.setConfig({ partialConfig: { irisColor } });
        }
        function extractFloatToString(floatString: string): string {
            return `${parseFloat(floatString)}`;
        }
        function extractIntToString(intString: string): string {
            return `${parseInt(intString, 10)}`;
        }
        function isValidSensitivity(sensitivity: string): boolean {
            return (
                !isNaN(parseFloat(sensitivity)) && parseFloat(sensitivity) >= 0
            );
        }
        function isValidFPS(fps: string): boolean {
            return !isNaN(parseInt(fps, 10)) && parseInt(fps, 10) > 0;
        }
        return (
            <ConfigMenu width="14em" timerLength={1000} window={props.window}>
                <TextBoxMenuItem
                    name={'X Sensitivity'}
                    defaultValue={`${props.config.xSensitivity}`}
                    isValidInput={isValidSensitivity}
                    onValidInput={parseAndStoreXSensitivity}
                    parse={extractFloatToString}
                />
                <TextBoxMenuItem
                    name={'Y Sensitivity'}
                    defaultValue={`${props.config.ySensitivity}`}
                    isValidInput={isValidSensitivity}
                    onValidInput={parseAndStoreYSensitivity}
                    parse={extractFloatToString}
                />
                <TextBoxMenuItem
                    name={'FPS'}
                    defaultValue={`${props.config.fps}`}
                    isValidInput={isValidFPS}
                    onValidInput={parseAndStoreFPS}
                    parse={extractIntToString}
                />
                <CheckBoxMenuItem
                    name={'Swap Eyes'}
                    checked={props.config.swapEyes}
                    onInputChange={storeSwapEyes}
                />
                <CheckBoxMenuItem
                    name={'Toggle Debug'}
                    checked={props.config.toggleDebug}
                    onInputChange={storeToggleDebug}
                />
                <ColorMenuItem
                    name={'Iris Color'}
                    color={props.config.irisColor}
                    onInputChange={storeIrisColor}
                />
                <CanvasMenuItem name={'Left Camera'} />
                <CanvasMenuItem name={'Right Camera'} />
            </ConfigMenu>
        );
    },
    (previous, next) => previous.config === next.config,
);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ConfigMenuElement);
