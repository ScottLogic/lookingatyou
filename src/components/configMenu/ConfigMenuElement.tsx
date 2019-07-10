import React from 'react';
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
        function storeIrisColor(irisColor: string) {
            props.setConfig({ partialConfig: { irisColor } });
        }
        function storeToggleDebug(toggleDebug: boolean) {
            props.setConfig({ partialConfig: { toggleDebug } });
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
                    helpWith={HelpWith.X_SENSITIVITY}
                />

                <TextBoxMenuItem
                    name={'Y Sensitivity'}
                    defaultValue={`${props.config.ySensitivity}`}
                    isValidInput={isValidSensitivity}
                    onValidInput={parseAndStoreYSensitivity}
                    parse={extractFloatToString}
                    helpWith={HelpWith.Y_SENSITIVITY}
                />

                <TextBoxMenuItem
                    name={'FPS'}
                    defaultValue={`${props.config.fps}`}
                    isValidInput={isValidFPS}
                    onValidInput={parseAndStoreFPS}
                    parse={extractIntToString}
                    helpWith={HelpWith.FPS}
                />

                <CheckBoxMenuItem
                    name={'Swap Eyes'}
                    helpWith={HelpWith.SWAP_EYES}
                    checked={props.config.swapEyes}
                    onInputChange={storeSwapEyes}
                />

                <ColorMenuItem
                    name={'Iris Colour'}
                    color={props.config.irisColor}
                    onInputChange={storeIrisColor}
                    helpWith={HelpWith.IRIS_COLOUR}
                />

                <CheckBoxMenuItem
                    name={'Toggle Debug'}
                    helpWith={HelpWith.DEBUG}
                    checked={props.config.toggleDebug}
                    onInputChange={storeToggleDebug}
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
                        </>
                    ) : (
                        <CanvasMenuItem
                            name={'Camera'}
                            videoIndex={0}
                            helpWith={HelpWith.VIDEO_STREAM}
                        />
                    )
                ) : null}

                <br />

                <p data-tip={true} data-for={HelpWith[HelpWith.APP]}>
                    Help
                </p>

                <Help problemWith={HelpWith.FPS} />
                <Help problemWith={HelpWith.VIDEO_STREAM} />
                <Help problemWith={HelpWith.X_SENSITIVITY} />
                <Help problemWith={HelpWith.Y_SENSITIVITY} />
                <Help problemWith={HelpWith.SWAP_EYES} />
                <Help problemWith={HelpWith.IRIS_COLOUR} />
                <Help problemWith={HelpWith.APP} />
                <Help problemWith={HelpWith.LEFT_VIDEO_STREAM} />
                <Help problemWith={HelpWith.RIGHT_VIDEO_STREAM} />
                <Help problemWith={HelpWith.DEBUG} />
            </ConfigMenu>
        );
    },
    (previous, next) => previous.config === next.config,
);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ConfigMenuElement);
