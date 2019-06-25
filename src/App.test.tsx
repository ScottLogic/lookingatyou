import jsdom from 'jsdom';
import React from 'react';
import ReactDOM from 'react-dom';
<<<<<<< HEAD
import App from './App';

it('renders without crashing', () => {
    const window = new jsdom.JSDOM(`...`, { url: 'http://localhost' }).window;
    const div = document.createElement('div');
    ReactDOM.render(<App environment={window} />, div);
    ReactDOM.unmountComponentAtNode(div);
=======
import jsdom from 'jsdom';
import { App } from './App';

it('renders without crashing', () => {
  const window = new jsdom.JSDOM(`...`, {url: "http://localhost"}).window;
  const div = document.createElement('div');
  const configureStream = jest.fn();
  ReactDOM.render(<App deviceIds={[]} environment={window} configureStream={configureStream} />, div);
  ReactDOM.unmountComponentAtNode(div);
>>>>>>> added enzyme to the project and 2 tests for the Video component
});
