import React from 'react';
import isEqual from 'react-fast-compare';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { updateConfigAction } from '../../store/actions/config/actions';
import {
    ConfigSetAction,
    IConfigState,
    PartialConfig,
} from '../../store/actions/config/types';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getConfig } from '../../store/selectors/configSelectors';
import { getVideos } from '../../store/selectors/videoSelectors';
import ConfigMenu from './ConfigMenu';
import Help, { HelpWith } from './Help';
import CanvasMenuItem from './menuItems/CanvasMenuItem';
import CheckBoxMenuItem from './menuItems/CheckBoxMenuItem';
import ColorMenuItem from './menuItems/ColorMenuItem';
import DropDownMenuItem from './menuItems/DropDownMenuItem';
import NumberMenuItem from './menuItems/NumberMenuItem';

export interface IConfigMenuElementProps {
    window: Window;
}

interface IConfigMenuElementMapStateToProps {
    config: IConfigState;
    videos: Array<HTMLVideoElement | undefined>;
}

interface IConfigMenuElementMapDispatchToProps {
    updateAppConfig: (payload: PartialConfig) => void;
    updateModelConfig: (payload: PartialConfig) => void;
    updateDetectionConfig: (payload: PartialConfig) => void;
}

export type ConfigMenuElementProps = IConfigMenuElementProps &
    IConfigMenuElementMapStateToProps &
    IConfigMenuElementMapDispatchToProps;

export const ConfigMenuElement = React.memo(
    (props: ConfigMenuElementProps) => {
        function renderUserConfig() {
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
                    {Object.values(HelpWith).map((type, key: number) => (
                        <Help
                            key={key}
                            problemWith={HelpWith[type] as HelpWith}
                        />
                    ))}
                </React.Fragment>
            );
        }

        function renderDevConfig() {
            return (
                <React.Fragment>
                    <h3>Load Config</h3>
                    <DropDownMenuItem
                        name={'Pose Model'}
                        configName={'architecture'}
                        onInputChange={props.updateModelConfig}
                        values={['MobileNetV1', 'ResNet50']}
                        defaultValue={props.config.modelConfig.architecture}
                        helpWith={HelpWith.ARCHITECTURE}
                    />
                    <DropDownMenuItem
                        name={'Output Stride'}
                        configName={'outputStride'}
                        onInputChange={props.updateModelConfig}
                        values={
                            props.config.modelConfig.architecture ===
                            'MobileNetV1'
                                ? ['8', '16']
                                : ['16', '32']
                        }
                        defaultValue={props.config.modelConfig.outputStride.toString()}
                        helpWith={HelpWith.OUTPUT_STRIDE}
                    />
                    <DropDownMenuItem
                        name={'Resolution'}
                        configName={'inputResolution'}
                        onInputChange={props.updateModelConfig}
                        values={[
                            '161',
                            '193',
                            '257',
                            '289',
                            '321',
                            '353',
                            '385',
                            '417',
                            '449',
                            '481',
                            '513',
                            '801',
                        ]}
                        defaultValue={props.config.modelConfig.inputResolution.toString()}
                        helpWith={HelpWith.RESOLUTION}
                    />
                    {props.config.modelConfig.architecture ===
                        'MobileNetV1' && (
                        <DropDownMenuItem
                            name={'Multiplier'}
                            configName={'multiplier'}
                            onInputChange={props.updateModelConfig}
                            values={['0.50', '0.75', '1']}
                            defaultValue={props.config.modelConfig.multiplier.toString()}
                            helpWith={HelpWith.MULTIPLIER}
                        />
                    )}

                    <h3>Detection Config</h3>
                    <NumberMenuItem
                        name={'Detections'}
                        configName={'maxDetections'}
                        step={1}
                        defaultValue={
                            props.config.detectionConfig.maxDetections
                        }
                        onValidInput={props.updateDetectionConfig}
                        helpWith={HelpWith.DETECTIONS}
                        min={1}
                    />
                    <CheckBoxMenuItem
                        name={'Flip Horizontal'}
                        configName={'flipHorizontal'}
                        helpWith={HelpWith.FLIP}
                        checked={props.config.detectionConfig.flipHorizontal}
                        onInputChange={props.updateDetectionConfig}
                    />
                    <NumberMenuItem
                        name={'Min Score'}
                        configName={'scoreThreshold'}
                        helpWith={HelpWith.MIN_SCORE}
                        step={0.01}
                        defaultValue={
                            props.config.detectionConfig.scoreThreshold
                        }
                        onValidInput={props.updateDetectionConfig}
                        min={0}
                        max={1}
                    />
                    <NumberMenuItem
                        name={'NMS Radius'}
                        configName={'nmsRadius'}
                        helpWith={HelpWith.NMS_RADIUS}
                        step={1}
                        defaultValue={props.config.detectionConfig.nmsRadius}
                        onValidInput={props.updateDetectionConfig}
                        min={1}
                    />

                    <h3>Debug</h3>
                    <CheckBoxMenuItem
                        name={'Toggle Debug'}
                        configName={'toggleDebug'}
                        helpWith={HelpWith.DEBUG}
                        checked={props.config.toggleDebug}
                        onInputChange={props.updateAppConfig}
                    />

                    <CanvasMenuItem
                        name={'Camera'}
                        helpWith={HelpWith.VIDEO_STREAM}
                        videoIndex={0}
                    />

                    {Object.values(HelpWith).map((type, key: number) => (
                        <Help
                            key={key}
                            problemWith={HelpWith[type] as HelpWith}
                        />
                    ))}
                </React.Fragment>
            );
        }

        return (
            <ConfigMenu
                width="14em"
                timerLength={1000}
                window={props.window}
                debugEnabled={props.config.toggleDebug}
            >
                <h1>Config</h1>
                <span
                    className="icon"
                    data-tip={true}
                    data-for={HelpWith[HelpWith.APP]}
                >
                    ?
                </span>

                {!props.config.toggleDebug
                    ? renderUserConfig()
                    : renderDevConfig()}
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
    updateAppConfig: (payload: PartialConfig) =>
        dispatch(
            updateConfigAction(
                ConfigSetAction.APP,
                payload,
                ownProps.window.document,
            ),
        ),
    updateModelConfig: (payload: PartialConfig) =>
        dispatch(
            updateConfigAction(
                ConfigSetAction.MODEL,
                payload,
                ownProps.window.document,
            ),
        ),
    updateDetectionConfig: (payload: PartialConfig) =>
        dispatch(
            updateConfigAction(
                ConfigSetAction.DETECTION,
                payload,
                ownProps.window.document,
            ),
        ),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ConfigMenuElement);
