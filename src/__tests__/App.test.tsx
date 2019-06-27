import { shallow } from 'enzyme';
import jsdom from 'jsdom';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AnyAction, Store } from 'redux';
import configureStore from 'redux-mock-store';
import ConnectedApp, { App as WrappedApp } from '../App';
import { initialState as initialConfigState } from '../store/reducers/configReducer';
import { initialState as initialDetectionState } from '../store/reducers/detectionReducer';
import { IRootStore } from '../store/reducers/rootReducer';
import { initialState as initialVideoState } from '../store/reducers/videoReducer';
import { testDevice1, testDevice2 } from './reducers/video/videoReducer.test';
let window: Window;
let div: HTMLElement;
let configureStream: jest.Mock;
let store: Store<any, AnyAction>;

describe('App', () => {
    beforeEach(() => {
        window = new jsdom.JSDOM(`...`, { url: 'http://localhost' }).window;
        div = document.createElement('div');
        configureStream = jest.fn();
    });

    it('renders without crashing', () => {
        const mockStore = configureStore();
        const initialState: IRootStore = {
            videoStore: initialVideoState,
            configStore: initialConfigState,
            detectionStore: initialDetectionState,
        };
        store = mockStore(initialState);
        configureStream = jest.fn();
        ReactDOM.render(
            <Provider store={store}>
                <ConnectedApp
                    environment={window}
                    configureStream={configureStream}
                />
            </Provider>,
            div,
        );
        ReactDOM.unmountComponentAtNode(div);
    });

    it('should render 2 video components when 2 devices are detected', () => {
        const wrapper = shallow(
            <WrappedApp
                deviceIds={[testDevice1, testDevice2]}
                environment={window}
                configureStream={configureStream}
                isModelLoaded={false}
            />,
        );
        expect(wrapper.find('Connect(Video)')).toHaveLength(2);
    });
});
