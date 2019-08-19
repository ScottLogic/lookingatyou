import React from 'react';
import {
    IAppConfig,
    UpdateConfigAction,
} from '../../store/actions/config/types';
import { HelpWith } from './Help';
import CheckBoxMenuItem from './menuItems/CheckBoxMenuItem';
import ColorMenuItem from './menuItems/ColorMenuItem';
import NumberMenuItem from './menuItems/NumberMenuItem';
import SliderMenuItem from './menuItems/SliderMenuItem';

interface IUserConfigProps {
    appConfig: IAppConfig;
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
                defaultValue={props.appConfig.fps}
                onValidInput={props.updateAppConfig}
                helpWith={HelpWith.FPS}
                min={1}
            />

            <SliderMenuItem
                name={'X Sensitivity'}
                configName={'xSensitivity'}
                step={0.05}
                defaultValue={props.appConfig.xSensitivity}
                onValidInput={props.updateAppConfig}
                helpWith={HelpWith.X_SENSITIVITY}
                min={0}
                max={1}
            />
            <SliderMenuItem
                name={'Y Sensitivity'}
                configName={'ySensitivity'}
                step={0.05}
                defaultValue={props.appConfig.ySensitivity}
                onValidInput={props.updateAppConfig}
                helpWith={HelpWith.Y_SENSITIVITY}
                min={0}
                max={1}
            />

            <br />

            <ColorMenuItem
                name={'Iris Colour'}
                configName={'irisColor'}
                color={props.appConfig.irisColor}
                onInputChange={props.updateAppConfig}
                helpWith={HelpWith.IRIS_COLOR}
            />

            <br />

            <CheckBoxMenuItem
                name={'Show Advanced Settings'}
                configName={'toggleAdvanced'}
                checked={props.appConfig.toggleAdvanced}
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
