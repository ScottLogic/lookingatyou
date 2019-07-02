import jsdom from 'jsdom';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import App from './App';
import { initialState as initialConfigState } from './store/reducers/configReducer';
import { IRootStore } from './store/reducers/rootReducer';
import { initialState as initialVideoState } from './store/reducers/videoReducer';

it('renders without crashing', () => {
    const window = new jsdom.JSDOM(`...`, { url: 'http://localhost' }).window;
    const div = document.createElement('div');
    const mockStore = configureStore();
    const initialState: IRootStore = {
        videoStore: initialVideoState,
        configStore: initialConfigState,
    };
    const store = mockStore(initialState);
    const configureStream = jest.fn();
    ReactDOM.render(
        <Provider store={store}>
            <App environment={window} configureStream={configureStream} />
        </Provider>,
        div,
    );
    ReactDOM.unmountComponentAtNode(div);
});
