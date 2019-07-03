import { shallow } from 'enzyme';
import jsdom from 'jsdom';
import React from 'react';
import {
    ConfigMenuElement,
    ConfigMenuElementProps,
} from '../../components/configMenu/ConfigMenuElement';
import IUserConfig from '../../components/configMenu/IUserConfig';

let props: ConfigMenuElementProps;
let config: IUserConfig;
let window: Window;

describe('ConfigMenuElement tests', () => {
    beforeEach(() => {
        config = {
            xSensitivity: 1,
            ySensitivity: 1,
            fps: 30,
            swapEyes: false,
            toggleDebug: false,
            irisColor: 'blue',
        };
        window = new jsdom.JSDOM(`...`, { url: 'http://localhost' }).window;

        props = {
            config,
            window,
            setConfig: jest.fn(),
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<ConfigMenuElement {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });
});
