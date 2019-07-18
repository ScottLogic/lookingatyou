import { shallow } from 'enzyme';
import jsdom from 'jsdom';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AnyAction, Store } from 'redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ConnectedApp from '../App';
import { initialState as initialConfigState } from '../store/reducers/configReducer';
import { initialState as initialDetectionState } from '../store/reducers/detectionReducer';
import { IRootStore } from '../store/reducers/rootReducer';
import { initialState as initialVideoState } from '../store/reducers/videoReducer';

let window: Window;
let div: HTMLElement;
let store: Store<any, AnyAction>;
let mediaDevices: null;

describe('App', () => {
    beforeEach(() => {
        window = new jsdom.JSDOM(`...`, { url: 'http://localhost' }).window;
        mediaDevices = null;
        div = document.createElement('div');
    });

    it('renders without crashing', () => {
        const mockStore = configureStore([thunk]);
        const initialState: IRootStore = {
            videoStore: initialVideoState,
            configStore: initialConfigState,
            detectionStore: initialDetectionState,
        };
        store = mockStore(initialState);
        ReactDOM.render(
            <Provider store={store}>
                <ConnectedApp
                    environment={window}
                    mediaDevices={mediaDevices}
                />
            </Provider>,
            div,
        );
        ReactDOM.unmountComponentAtNode(div);
    });
});
