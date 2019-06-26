import React from 'react';
import ConfigMenu from './ConfigMenu';
import InterfaceUserConfig from './InterfaceUserConfig';
import CanvasMenuItem from './menuItems/CanvasMenuItem';
import CheckBoxMenuItem from './menuItems/CheckBoxMenuItem';
import ColorMenuItem from './menuItems/ColorMenuItem';
import TextBoxMenuItem from './menuItems/TextBoxMenuItem';
interface ILookingAtYouConfig {
    config: InterfaceUserConfig;
    store: (partialState: Partial<InterfaceUserConfig>) => void;
}
export default function LookingAtYouConfig(props: ILookingAtYouConfig) {
    function parseAndStoreXSensitivity(xSensitivity: string) {
        props.store({ xSensitivity: parseFloat(xSensitivity) });
    }
    function parseAndStoreYSensitivity(ySensitivity: string) {
        props.store({ ySensitivity: parseFloat(ySensitivity) });
    }
    function parseAndStoreFPS(fps: string) {
        props.store({ fps: parseInt(fps, 10) });
    }
    function storeSwapEyes(swapEyes: boolean) {
        props.store({ swapEyes });
    }
    function storeToggleDebug(toggleDebug: boolean) {
        props.store({ toggleDebug });
    }
    function storeIrisColor(irisColor: string) {
        props.store({ irisColor });
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
