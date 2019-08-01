import { shallow } from 'enzyme';
import jsdom from 'jsdom';
import React from 'react';
import {
    MovementHandler,
    MovementHandlerProps,
} from '../../components/intelligentMovement/MovementHandler';

let props: MovementHandlerProps;
const imageData = { data: new Uint8ClampedArray(0), width: 10, height: 10 };
const mockUpdateAnimation = jest.fn();

describe('Movement Handler', () => {
    beforeEach(() => {
        props = {
            width: 1920,
            height: 1080,
            environment: new jsdom.JSDOM(`...`, { url: 'http://localhost' })
                .window,
            fps: 1000,
            detections: [],
            target: { x: 0, y: 0 },
            images: { test: imageData },
            animation: [],
            updateAnimation: mockUpdateAnimation,
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<MovementHandler {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });

    it('should dispatch updateAnimation when there are no detections', () => {
        jest.useFakeTimers();
        const wrapper = shallow(<MovementHandler {...props} />);
        wrapper.setProps({
            detections: [],
        });
        jest.advanceTimersByTime(20);
        expect(mockUpdateAnimation).toBeCalled();
    });
});
