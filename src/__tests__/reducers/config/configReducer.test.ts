import { setConfigAction } from '../../../store/actions/config/actions';
import {
    ConfigAction,
    ConfigSetAction,
    IConfigState,
    PartialConfig,
} from '../../../store/actions/config/types';
import configStore, {
    initalModelConfig,
    initialConfig,
    initialDetectionConfig,
} from '../../../store/reducers/configReducer';

describe('Config Reducer tests', () => {
    const testState: IConfigState = initialConfig;
    it('update config with partial state, so some values are updated and others are as they were before', () => {
        const payload = { fps: 555, irisColor: 'red' };
        const setAction: ConfigAction = setConfigAction(
            ConfigSetAction.APP,
            payload,
        );
        const alteredState: IConfigState = {
            ...testState,
            appConfig: {
                ...testState.appConfig,
                fps: 555,
                irisColor: 'red',
            },
        };
        expect(configStore(testState, setAction)).toStrictEqual(alteredState);
    });
});
