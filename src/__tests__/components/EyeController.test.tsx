import { shallow } from 'enzyme';
import jsdom from 'jsdom';
import React from 'react';
import {
    EyeController,
    EyeControllerProps,
} from '../../components/eye/EyeController';
import { IConfigState } from '../../store/actions/config/types';

let props: EyeControllerProps;
let configState: IConfigState;

describe('Eye Controller', () => {
    beforeEach(() => {
        configState = {
            config: {
                xSensitivity: 1,
                ySensitivity: 1,
                fps: 2,
                swapEyes: false,
                toggleDebug: false,
                irisColor: '#ff8080',
            },
        };
        props = {
            width: 500,
            height: 500,
            environment: new jsdom.JSDOM().window,
            target: { x: 250, y: 250 },
            config: configState.config,
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<EyeController {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });
});