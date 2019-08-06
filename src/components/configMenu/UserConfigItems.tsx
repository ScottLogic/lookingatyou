import React from 'react';
import { IConfigState, PartialConfig } from '../../store/actions/config/types';
import { HelpWith } from './Help';
import CanvasMenuItem from './menuItems/CanvasMenuItem';
import CheckBoxMenuItem from './menuItems/CheckBoxMenuItem';
import ColorMenuItem from './menuItems/ColorMenuItem';
import NumberMenuItem from './menuItems/NumberMenuItem';

interface IUserConfigProps {
    config: IConfigState;
    updateAppConfig: (payload: PartialConfig) => void;
}
export default function UserConfig(props: IUserConfigProps) {
    return (
        <React.Fragment>
            <NumberMenuItem
                name={'FPS'}
                configName={'fps'}
                step={1}
                defaultValue={props.config.fps}
                onValidInput={props.updateAppConfig}
                helpWith={HelpWith.FPS}
                min={1}
            />

            <br />

            <NumberMenuItem
                name={'X Sensitivity'}
                configName={'xSensitivity'}
                step={0.1}
                defaultValue={props.config.xSensitivity}
                onValidInput={props.updateAppConfig}
                helpWith={HelpWith.X_SENSITIVITY}
                min={0}
            />
            <NumberMenuItem
                name={'Y Sensitivity'}
                configName={'ySensitivity'}
                step={0.1}
                defaultValue={props.config.ySensitivity}
                onValidInput={props.updateAppConfig}
                helpWith={HelpWith.Y_SENSITIVITY}
                min={0}
            />

            <ColorMenuItem
                name={'Iris Colour'}
                configName={'irisColor'}
                color={props.config.irisColor}
                onInputChange={props.updateAppConfig}
                helpWith={HelpWith.IRIS_COLOR}
            />

            <br />
            <CheckBoxMenuItem
                name={'Show Reflect'}
                configName={'toggleReflection'}
                helpWith={HelpWith.REFLECTION}
                checked={props.config.toggleReflection}
                onInputChange={props.updateAppConfig}
            />
            {props.config.toggleReflection && (
                <NumberMenuItem
                    name={'Reflect Opacity'}
                    configName={'reflectionOpacity'}
                    step={0.01}
                    defaultValue={props.config.reflectionOpacity}
                    onValidInput={props.updateAppConfig}
                    helpWith={HelpWith.REFLECTION_OPACITY}
                    min={0.01}
                    max={1.0}
                />
            )}
            <CheckBoxMenuItem
                name={'Toggle Debug'}
                configName={'toggleDebug'}
                helpWith={HelpWith.DEBUG}
                checked={props.config.toggleDebug}
                onInputChange={props.updateAppConfig}
            />
            {props.config.toggleDebug && (
                <CanvasMenuItem
                    name={'Camera'}
                    helpWith={HelpWith.VIDEO_STREAM}
                    videoIndex={0}
                />
            )}
            <CheckBoxMenuItem
                name={'Toggle Advanced'}
                configName={'toggleAdvanced'}
                helpWith={HelpWith.ADVANCE_SETTINGS}
                checked={props.config.toggleAdvanced}
                onInputChange={props.updateAppConfig}
            />
        </React.Fragment>
    );
}
