import React from 'react';
import isEqual from 'react-fast-compare';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    ISetConfigPayload,
    UPDATE_CONFIG,
} from '../../store/actions/config/types';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getConfig } from '../../store/selectors/configSelectors';
import { getVideos } from '../../store/selectors/videoSelectors';
import ConfigMenu from './ConfigMenu';
import Help, { HelpWith } from './Help';
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
    videoCount: number;
}
const mapStateToProps = (
    state: IRootStore,
): IConfigMenuElementMapStateToProps => {
    return {
        config: getConfig(state),
        videoCount: getVideos(state).length,
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
        return (
            <ConfigMenu width="14em" timerLength={1000} window={props.window}>
                <TextBoxMenuItem
                    name={'X Sensitivity'}
                    configName={'xSensitivity'}
                    step={0.1}
                    defaultValue={props.config.xSensitivity}
                    onValidInput={props.setConfig}
                    configParse={parseFloat}
                    helpWith={HelpWith.X_SENSITIVITY}
                />

                <TextBoxMenuItem
                    name={'Y Sensitivity'}
                    configName={'ySensitivity'}
                    step={0.1}
                    defaultValue={props.config.ySensitivity}
                    onValidInput={props.setConfig}
                    configParse={parseFloat}
                    helpWith={HelpWith.Y_SENSITIVITY}
                />

                <TextBoxMenuItem
                    name={'FPS'}
                    configName={'fps'}
                    step={1}
                    defaultValue={props.config.fps}
                    onValidInput={props.setConfig}
                    configParse={parseInt}
                    helpWith={HelpWith.FPS}
                />

                <CheckBoxMenuItem
                    name={'Swap Eyes'}
                    configName={'swapEyes'}
                    helpWith={HelpWith.SWAP_EYES}
                    checked={props.config.swapEyes}
                    onInputChange={props.setConfig}
                />

                <ColorMenuItem
                    name={'Iris Colour'}
                    configName={'irisColor'}
                    color={props.config.irisColor}
                    onInputChange={props.setConfig}
                    helpWith={HelpWith.IRIS_COLOUR}
                />

                <CheckBoxMenuItem
                    name={'Toggle Debug'}
                    configName={'toggleDebug'}
                    helpWith={HelpWith.DEBUG}
                    checked={props.config.toggleDebug}
                    onInputChange={props.setConfig}
                />

                {props.config.toggleDebug ? (
                    props.videoCount > 1 ? (
                        <>
                            <CanvasMenuItem
                                name={'L Camera'}
                                videoIndex={0}
                                helpWith={HelpWith.LEFT_VIDEO_STREAM}
                            />
                            <CanvasMenuItem
                                name={'R Camera'}
                                videoIndex={1}
                                helpWith={HelpWith.RIGHT_VIDEO_STREAM}
                            />

                            <Help problemWith={HelpWith.LEFT_VIDEO_STREAM} />
                            <Help problemWith={HelpWith.RIGHT_VIDEO_STREAM} />
                        </>
                    ) : (
                        <>
                            <CanvasMenuItem
                                name={'Camera'}
                                videoIndex={0}
                                helpWith={HelpWith.VIDEO_STREAM}
                            />

                            <Help problemWith={HelpWith.VIDEO_STREAM} />
                        </>
                    )
                ) : null}

                <br />

                <p data-tip={true} data-for={HelpWith[HelpWith.APP]}>
                    Help
                </p>

                <Help problemWith={HelpWith.FPS} />
                <Help problemWith={HelpWith.X_SENSITIVITY} />
                <Help problemWith={HelpWith.Y_SENSITIVITY} />
                <Help problemWith={HelpWith.SWAP_EYES} />
                <Help problemWith={HelpWith.IRIS_COLOUR} />
                <Help problemWith={HelpWith.APP} />
                <Help problemWith={HelpWith.DEBUG} />
            </ConfigMenu>
        );
    },
    (previous, next) => isEqual(previous, next),
);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ConfigMenuElement);
