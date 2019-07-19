import React from 'react';
import isEqual from 'react-fast-compare';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { updateConfigAction } from '../../store/actions/config/actions';
import { ISetConfigPayload } from '../../store/actions/config/types';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getConfig } from '../../store/selectors/configSelectors';
import { getVideos } from '../../store/selectors/videoSelectors';
import ConfigMenu from './ConfigMenu';
import Help, { HelpWith } from './Help';
import IUserConfig from './IUserConfig';
import CanvasMenuItem from './menuItems/CanvasMenuItem';
import CheckBoxMenuItem from './menuItems/CheckBoxMenuItem';
import ColorMenuItem from './menuItems/ColorMenuItem';
import NumberMenuItem from './menuItems/NumberMenuItem';

export interface IConfigMenuElementProps {
    window: Window;
}

interface IConfigMenuElementMapStateToProps {
    config: IUserConfig;
    videos: Array<HTMLVideoElement | undefined>;
}

interface IConfigMenuElementMapDispatchToProps {
    setConfig: (payload: ISetConfigPayload) => void;
}

export type ConfigMenuElementProps = IConfigMenuElementProps &
    IConfigMenuElementMapStateToProps &
    IConfigMenuElementMapDispatchToProps;

export const ConfigMenuElement = React.memo(
    (props: ConfigMenuElementProps) => {
        const canvasData = [
            { name: 'Left Camera', helpWith: HelpWith.LEFT_VIDEO_STREAM },
            { name: 'Right Camera', helpWith: HelpWith.RIGHT_VIDEO_STREAM },
        ];

        return (
            <ConfigMenu
                width="14em"
                timerLength={1000}
                window={props.window}
                debugEnabled={props.config.toggleDebug}
            >
                <span data-tip={true} data-for={HelpWith[HelpWith.APP]}>
                    ?
                </span>

                <NumberMenuItem
                    name={'FPS'}
                    configName={'fps'}
                    step={1}
                    defaultValue={props.config.fps}
                    onValidInput={props.setConfig}
                    helpWith={HelpWith.FPS}
                    min={1}
                />

                <br />

                <NumberMenuItem
                    name={'X Sensitivity'}
                    configName={'xSensitivity'}
                    step={0.1}
                    defaultValue={props.config.xSensitivity}
                    onValidInput={props.setConfig}
                    helpWith={HelpWith.X_SENSITIVITY}
                    min={0}
                />
                <NumberMenuItem
                    name={'Y Sensitivity'}
                    configName={'ySensitivity'}
                    step={0.1}
                    defaultValue={props.config.ySensitivity}
                    onValidInput={props.setConfig}
                    helpWith={HelpWith.Y_SENSITIVITY}
                    min={0}
                />

                <br />

                {props.videos.length > 1 && (
                    <CheckBoxMenuItem
                        name={'Swap Eyes'}
                        configName={'swapEyes'}
                        helpWith={HelpWith.SWAP_EYES}
                        checked={props.config.swapEyes}
                        onInputChange={props.setConfig}
                    />
                )}
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

                {props.config.toggleDebug
                    ? props.videos.map((ignore, index, videos) => {
                          return (
                              <CanvasMenuItem
                                  name={
                                      videos.length === 1
                                          ? 'Camera'
                                          : canvasData[index].name
                                  }
                                  key={index}
                                  helpWith={canvasData[index].helpWith}
                                  videoIndex={index}
                              />
                          );
                      })
                    : null}

                {Object.values(HelpWith).map((type, key: number) => (
                    <Help key={key} problemWith={HelpWith[type] as HelpWith} />
                ))}
            </ConfigMenu>
        );
    },
    (previous, next) => isEqual(previous, next),
);

const mapStateToProps = (
    state: IRootStore,
): IConfigMenuElementMapStateToProps => ({
    config: getConfig(state),
    videos: getVideos(state),
});

const mapDispatchToProps = (
    dispatch: ThunkDispatch<IRootStore, void, Action>,
    ownProps: IConfigMenuElementProps,
) => ({
    setConfig: (payload: ISetConfigPayload) =>
        dispatch(updateConfigAction(payload, ownProps.window.document)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ConfigMenuElement);
