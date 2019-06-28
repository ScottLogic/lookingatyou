import jsdom from 'jsdom';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
    const window = new jsdom.JSDOM(`...`, { url: 'http://localhost' }).window;
    const div = document.createElement('div');
    const configureStream = jest.fn();
    ReactDOM.render(
        <App environment={window} configureStream={configureStream} />,
        div,
    );
    ReactDOM.unmountComponentAtNode(div);
});
