import { shallow } from 'enzyme';
import jsdom from 'jsdom';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import {
    EyeController,
    EyeControllerProps,
} from '../../components/eye/EyeController';
import { IConfigState } from '../../store/actions/config/types';
import configStore, {
    initialState as initialConfigState,
} from '../../store/reducers/configReducer';
import { initialState as initialDetectionState } from '../../store/reducers/detectionReducer';
import { IRootStore } from '../../store/reducers/rootReducer';
import { initialState as initialVideoState } from '../../store/reducers/videoReducer';

let props: EyeControllerProps;
let configState: IConfigState;

describe('Eye Controller', () => {
    beforeEach(() => {
        configState = {
            config: {
                xSensitivity: 1,
                ySensitivity: 1,
                fps: 2,
                swapEyes: false,
                toggleDebug: false,
                irisColor: '#ff8080',
                bbox: [0, 0, 0, 0],
            },
        };
        props = {
            width: 500,
            height: 500,
            environment: new jsdom.JSDOM().window,
            target: { left: { x: 250, y: 250 }, right: null },
            config: configState.config,
            dilation: 1,
            openCoefficient: 0.45,
            detected: true,
            videos: [],
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
