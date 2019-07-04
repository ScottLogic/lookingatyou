import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import configureStream from './components/webcamHandler/WebcamHandler';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { createStore } from './store/store';

const getEnvironment = () => {
    return window;
};

const store = createStore();

ReactDOM.render(
    <Provider store={store}>
        <App
            environment={getEnvironment()}
            configureStream={configureStream}
            store={store}
        />
    </Provider>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
