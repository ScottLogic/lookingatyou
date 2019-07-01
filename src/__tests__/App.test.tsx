import { shallow } from 'enzyme';
import jsdom from 'jsdom';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from '../App';
import { testDevice1, testDevice2 } from './reducers/video/videoReducer.test';

let window: Window;
let div: HTMLElement;
let configureStream: jest.Mock;

describe('App', () => {
    beforeEach(() => {
        window = new jsdom.JSDOM(`...`, { url: 'http://localhost' }).window;
        div = document.createElement('div');
        configureStream = jest.fn();
    });

    it('renders without crashing', () => {
        ReactDOM.render(
            <App
                deviceIds={[]}
                environment={window}
                configureStream={configureStream}
                videos={[]}
            />,
            div,
        );
        ReactDOM.unmountComponentAtNode(div);
    });

    it('should render 2 video components when 2 devices are detected', () => {
        const wrapper = shallow(
            <App
                deviceIds={[testDevice1, testDevice2]}
                environment={window}
                configureStream={configureStream}
                videos={[]}
            />,
        );
        expect(wrapper.find('Connect(Video)')).toHaveLength(2);
    });
});
