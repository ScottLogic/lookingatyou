import React from 'react';
import { IConfigState, PartialConfig } from '../../store/actions/config/types';
import { HelpWith } from './Help';
import CheckBoxMenuItem from './menuItems/CheckBoxMenuItem';
import ColorMenuItem from './menuItems/ColorMenuItem';
import NumberMenuItem from './menuItems/NumberMenuItem';

interface IUserConfigProps {
    config: IConfigState;
    updateAppConfig: (payload: PartialConfig) => void;
    window: Window;
}
export default function UserConfig(props: IUserConfigProps) {
    return (
        <>
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

            <br />

            <ColorMenuItem
                name={'Iris Colour'}
                configName={'irisColor'}
                color={props.config.irisColor}
                onInputChange={props.updateAppConfig}
                helpWith={HelpWith.IRIS_COLOUR}
            />

            <br />

            <CheckBoxMenuItem
                name={'Toggle Advanced'}
                configName={'toggleAdvanced'}
                helpWith={HelpWith.ADVANCE_SETTINGS}
                checked={props.config.toggleAdvanced}
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
