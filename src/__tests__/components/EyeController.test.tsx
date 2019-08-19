import { shallow } from 'enzyme';
import jsdom from 'jsdom';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import EyeController, {
    EyeControllerProps,
    IEyeControllerProps,
} from '../../components/eye/EyeController';
import { IConfigState } from '../../store/actions/config/types';
import configStore, {
    initialConfig as initialConfigState,
} from '../../store/reducers/configReducer';
import { initialState as initialDetectionState } from '../../store/reducers/detectionReducer';
import { IRootStore } from '../../store/reducers/rootReducer';
import { initialState as initialVideoState } from '../../store/reducers/videoReducer';

let props: IEyeControllerProps;
let configState: IConfigState;

describe('Eye Controller', () => {
    beforeEach(() => {
        configState = {
            appConfig: {
                xSensitivity: 1,
                ySensitivity: 1,
                fps: 2,
                irisColor: '#ff8080',
                toggleAdvanced: false,
                showHelp: false,
            },
            advancedConfig: {
                toggleReflection: false,
                toggleDebug: false,
                reflectionOpacity: 0.2,
                modelConfig: {
                    architecture: 'MobileNetV1',
                    inputResolution: 161,
                    multiplier: 0.5,
                    outputStride: 16,
                },
                detectionConfig: {
                    flipHorizontal: false,
                    maxDetections: 3,
                    nmsRadius: 20,
                    scoreThreshold: 0.5,
                },
            },
        };
        props = {
            width: 500,
            height: 500,
            environment: new jsdom.JSDOM().window,
            target: { x: 250, y: 250 },
            dilation: 1,
            openCoefficient: 0.45,
            detected: true,
            isSleeping: false,
        };
    });

    it('should render correctly', () => {
        const mockStore = configureStore();
        const initialState: IRootStore = {
            videoStore: initialVideoState,
            configStore: initialConfigState,
            detectionStore: initialDetectionState,
        };
        const store = mockStore(initialState);
        const wrapper = shallow(
            <Provider store={store}>
                <EyeController {...props} />
            </Provider>,
        ).debug();
        expect(wrapper).toMatchSnapshot();
    });
});
