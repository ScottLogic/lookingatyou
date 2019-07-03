import React from 'react';
import { connect } from 'react-redux';
import { updateConfigAction } from '../../store/actions/config/actions';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getConfig } from '../../store/selectors/configSelectors';
import store from '../../store/store';
import ConfigMenu from './ConfigMenu';
import IUserConfig from './IUserConfig';
import CanvasMenuItem from './menuItems/CanvasMenuItem';
import CheckBoxMenuItem from './menuItems/CheckBoxMenuItem';
import ColorMenuItem from './menuItems/ColorMenuItem';
import TextBoxMenuItem from './menuItems/TextBoxMenuItem';

interface IConfigMenuElementProps {
    storage: Storage;
    config: IUserConfig;
    window: Window;
}

interface IConfigMenuElementMapStateToProps {
    config: IUserConfig;
}

export type ConfigMenuElementProps = IConfigMenuElementProps &
    IConfigMenuElementMapStateToProps;

const mapStateToProps = (
    state: IRootStore,
): IConfigMenuElementMapStateToProps => {
    return {
        config: getConfig(state),
    };
};

export function ConfigMenuElement(props: ConfigMenuElementProps) {
    function parseAndStoreXSensitivity(xSensitivity: string) {
        store.dispatch(
            updateConfigAction({
                partialConfig: {
                    xSensitivity: parseFloat(xSensitivity),
                },
            }),
        );
    }

    function parseAndStoreYSensitivity(ySensitivity: string) {
        store.dispatch(
            updateConfigAction({
                partialConfig: {
                    ySensitivity: parseFloat(ySensitivity),
                },
            }),
        );
    }

    function parseAndStoreFPS(fps: string) {
        store.dispatch(
            updateConfigAction({
                partialConfig: { fps: parseInt(fps, 10) },
            }),
        );
    }

    function storeSwapEyes(swapEyes: boolean) {
        store.dispatch(updateConfigAction({ partialConfig: { swapEyes } }));
    }

    function storeToggleDebug(toggleDebug: boolean) {
        store.dispatch(
            updateConfigAction({
                partialConfig: { toggleDebug },
            }),
        );
    }

    function storeIrisColor(irisColor: string) {
        store.dispatch(updateConfigAction({ partialConfig: { irisColor } }));
    }

    function extractFloatToString(floatString: string): string {
        return `${parseFloat(floatString)}`;
    }

    function extractIntToString(intString: string): string {
        return `${parseInt(intString, 10)}`;
    }

    function isValidSensitivity(sensitivity: string): boolean {
        return !isNaN(parseFloat(sensitivity)) && parseFloat(sensitivity) >= 0;
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
}

export default connect(mapStateToProps)(ConfigMenuElement);
