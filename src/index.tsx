import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import store from './store/store';

const getEnvironment = () => { return window }

<<<<<<< HEAD

ReactDOM.render(<App environment={getEnvironment()}/>, document.getElementById('root'));
=======
ReactDOM.render(
  <Provider store={store}>
    <App environment={getEnvironment()} />
  </Provider>,
  document.getElementById('root')
);
>>>>>>> refactor for webcam handler and multiple webcams

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
