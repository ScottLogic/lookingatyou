import {
    resetConfigAction,
    setConfigAction,
} from '../../../store/actions/config/actions';
import { IConfigState } from '../../../store/actions/config/types';
import configStore, {
    initialState,
} from '../../../store/reducers/configReducer';

describe('Config Reducer tests', () => {
    const testState: IConfigState = {
        config: {
            xSensitivity: 10,
            ySensitivity: 10,
            fps: 5,
            irisColor: '#252525',
            swapEyes: true,
            toggleDebug: false,
        },
    };
    it('reset config, so state is equivelant to initial state', () => {
        const resetAction = resetConfigAction();
        expect(configStore(testState, resetAction)).toStrictEqual(initialState);
    });
    it('update config with partial state, so some values are updated and others are as they were before', () => {
        const partialConfig = { fps: 555, toggleDebug: true, irisColor: 'red' };
        const setAction = setConfigAction({ partialConfig });
        const alteredState: IConfigState = {
            config: {
                xSensitivity: 10,
                ySensitivity: 10,
                fps: 555,
                irisColor: 'red',
                swapEyes: true,
                toggleDebug: true,
            },
        };
        expect(configStore(testState, setAction)).toStrictEqual(alteredState);
    });
});
