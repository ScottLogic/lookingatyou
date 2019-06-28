import React, { useState } from 'react';
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
}
interface IConfigMenuElementMapStateToProps {
    config: IUserConfig;
}
type ConfigMenuElementProps = IConfigMenuElementProps &
    IConfigMenuElementMapStateToProps;
const mapStateToProps = (
    state: IRootStore,
): IConfigMenuElementMapStateToProps => {
    return {
        config: getConfig(state),
    };
};

function ConfigMenuElement(props: ConfigMenuElementProps) {
    const unsubscribe = store.subscribe(() => {
        props.storage.setItem(
            'config',
            JSON.stringify(store.getState().configStore.config),
        );
    });
    useState(() => {
        const json = props.storage.getItem('config');
        if (json != null) {
            store.dispatch(
                updateConfigAction({ partialConfig: JSON.parse(json) }),
            );
        }
        return () => unsubscribe();
    });
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
    function validFloatString(floatString: string): boolean {
        return !isNaN(parseFloat(floatString));
    }
    function validIntString(intString: string): boolean {
        return !isNaN(parseInt(intString, 10));
    }
    return (
        <ConfigMenu width="14em" timerLength={1000}>
            <TextBoxMenuItem
                name={'X Sensitivity'}
                defaultValue={`${props.config.xSensitivity}`}
                isValidInput={validFloatString}
                onValidInput={parseAndStoreXSensitivity}
                parse={extractFloatToString}
            />
            <TextBoxMenuItem
                name={'Y Sensitivity'}
                defaultValue={`${props.config.ySensitivity}`}
                isValidInput={validFloatString}
                onValidInput={parseAndStoreYSensitivity}
                parse={extractFloatToString}
            />
            <TextBoxMenuItem
                name={'FPS'}
                defaultValue={`${props.config.fps}`}
                isValidInput={validIntString}
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
