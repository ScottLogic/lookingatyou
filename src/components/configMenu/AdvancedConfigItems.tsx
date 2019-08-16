import React from 'react';
import { IConfigState, PartialConfig } from '../../store/actions/config/types';
import { HelpWith } from './Help';
import CanvasMenuItem from './menuItems/CanvasMenuItem';
import CheckBoxMenuItem from './menuItems/CheckBoxMenuItem';
import DropDownMenuItem from './menuItems/DropDownMenuItem';
import NumberMenuItem from './menuItems/NumberMenuItem';
import SliderMenuItem from './menuItems/SliderMenuItem';

interface IAdvancedConfigProps {
    window: Window;
    config: IConfigState;
    updateModelConfig: (payload: PartialConfig) => void;
    updateDetectionConfig: (payload: PartialConfig) => void;
    updateAppConfig: (payload: PartialConfig) => void;
}
export default function AdvancedConfig(props: IAdvancedConfigProps) {
    return (
        <>
            <CheckBoxMenuItem
                name={'Show Reflection'}
                configName={'toggleReflection'}
                helpWith={HelpWith.REFLECTION}
                checked={props.config.toggleReflection}
                onInputChange={props.updateAppConfig}
            />

            {props.config.toggleReflection && (
                <SliderMenuItem
                    name={'Reflection Opacity'}
                    configName={'reflectionOpacity'}
                    step={0.05}
                    defaultValue={props.config.reflectionOpacity}
                    onValidInput={props.updateAppConfig}
                    helpWith={HelpWith.REFLECTION_OPACITY}
                    min={0.0}
                    max={1.0}
                />
            )}
            <CheckBoxMenuItem
                name={'Toggle Camera Feed'}
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

            <br />

            <h3>Model Settings</h3>
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
                    props.config.modelConfig.architecture === 'MobileNetV1'
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
            {props.config.modelConfig.architecture === 'MobileNetV1' && (
                <DropDownMenuItem
                    name={'Multiplier'}
                    configName={'multiplier'}
                    onInputChange={props.updateModelConfig}
                    values={['0.5', '0.75', '1']}
                    defaultValue={props.config.modelConfig.multiplier.toString()}
                    helpWith={HelpWith.MULTIPLIER}
                />
            )}

            <br />

            <h3>Detection Settings</h3>
            <NumberMenuItem
                name={'Detections'}
                configName={'maxDetections'}
                noDecimals={true}
                step={1}
                defaultValue={props.config.detectionConfig.maxDetections}
                onValidInput={props.updateDetectionConfig}
                helpWith={HelpWith.DETECTIONS}
                min={1}
            />

            <SliderMenuItem
                name={'Minimum Confidence'}
                configName={'scoreThreshold'}
                helpWith={HelpWith.MIN_SCORE}
                step={0.01}
                defaultValue={props.config.detectionConfig.scoreThreshold}
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
        </>
    );
}
