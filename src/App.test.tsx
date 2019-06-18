import React from 'react';
import ReactDOM from 'react-dom';
import jsdom from 'jsdom';
import App from './App';

it('renders without crashing', () => {
  const window = new jsdom.JSDOM().window;
  const div = document.createElement('div');
  ReactDOM.render(<App environment={window} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
