import { setConfigAction } from '../../../store/actions/config/actions';
import {
    ConfigAction,
    ConfigSetAction,
    IConfigState,
} from '../../../store/actions/config/types';
import configStore, {
    initalModelConfig,
    initialDetectionConfig,
} from '../../../store/reducers/configReducer';

describe('Config Reducer tests', () => {
    const testState: IConfigState = {
        xSensitivity: 10,
        ySensitivity: 10,
        fps: 5,
        irisColor: '#252525',
        toggleDebug: false,
        modelConfig: initalModelConfig,
        detectionConfig: initialDetectionConfig,
        toggleReflection: false,
        reflectionOpacity: 0,
    };
    it('update config with partial state, so some values are updated and others are as they were before', () => {
        const partialConfig = { fps: 555, toggleDebug: true, irisColor: 'red' };
        const setAction: ConfigAction = setConfigAction(
            ConfigSetAction.APP,
            partialConfig,
        );
        const alteredState: IConfigState = {
            xSensitivity: 10,
            ySensitivity: 10,
            fps: 555,
            irisColor: 'red',
            toggleDebug: true,
            modelConfig: initalModelConfig,
            detectionConfig: initialDetectionConfig,
            toggleReflection: false,
            reflectionOpacity: 0,
        };
        expect(configStore(testState, setAction)).toStrictEqual(alteredState);
    });
});
