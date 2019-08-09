import React from 'react';
import {
    IConfigState,
    UpdateConfigAction,
} from '../../store/actions/config/types';
import { HelpWith } from './Help';
import CheckBoxMenuItem from './menuItems/CheckBoxMenuItem';
import ColorMenuItem from './menuItems/ColorMenuItem';
import NumberMenuItem from './menuItems/NumberMenuItem';
import SliderMenuItem from './menuItems/SliderMenuItem';

interface IUserConfigProps {
    config: IConfigState;
    updateAppConfig: UpdateConfigAction;
    window: Window;
}
export default function UserConfig(props: IUserConfigProps) {
    return (
        <>
            <NumberMenuItem
                name={'Detections Per Second'}
                configName={'fps'}
                step={1}
                defaultValue={props.config.appConfig.fps}
                onValidInput={props.updateAppConfig}
                helpWith={HelpWith.FPS}
                min={1}
            />

            <SliderMenuItem
                name={'X Sensitivity'}
                configName={'xSensitivity'}
                step={0.05}
                defaultValue={props.config.appConfig.xSensitivity}
                onValidInput={props.updateAppConfig}
                helpWith={HelpWith.X_SENSITIVITY}
                min={0}
                max={1}
            />
            <SliderMenuItem
                name={'Y Sensitivity'}
                configName={'ySensitivity'}
                step={0.05}
                defaultValue={props.config.appConfig.ySensitivity}
                onValidInput={props.updateAppConfig}
                helpWith={HelpWith.Y_SENSITIVITY}
                min={0}
                max={1}
            />

            <br />

            <ColorMenuItem
                name={'Iris Colour'}
                configName={'irisColor'}
                color={props.config.appConfig.irisColor}
                onInputChange={props.updateAppConfig}
                helpWith={HelpWith.IRIS_COLOR}
            />

            <br />

            <CheckBoxMenuItem
                name={'Show Advanced Settings'}
                configName={'toggleAdvanced'}
                helpWith={HelpWith.ADVANCE_SETTINGS}
                checked={props.config.appConfig.toggleAdvanced}
                onInputChange={props.updateAppConfig}
                warning={
                    <>
                        The advanced settings are intended for users with a
                        technical understanding of the app and changing them
                        from the defaults could lead to the app becoming
                        unstable.
                    </>
                }
            />
        </>
    );
}
