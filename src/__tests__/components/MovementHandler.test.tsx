import { shallow } from 'enzyme';
import jsdom from 'jsdom';
import React from 'react';
import {
    MovementHandler,
    MovementHandlerProps,
} from '../../components/intelligentMovement/MovementHandler';

let props: MovementHandlerProps;

const data = new Uint8ClampedArray(400);

for (let i = 0; i < 400; i += 4) {
    data[i + 0] = 190; // R value
    data[i + 1] = 0; // G value
    data[i + 2] = 210; // B value
    data[i + 3] = 255; // A value
}

const imageData = { data, width: 10, height: 10 };
const mockSetIdleTargets = jest.fn();

describe('Movement Handler', () => {
    beforeEach(() => {
        props = {
            width: 1920,
            height: 1080,
            environment: new jsdom.JSDOM(`...`, { url: 'http://localhost' })
                .window,
            setIdleTarget: mockSetIdleTargets,
            fps: 1000,
            detections: [],
            target: { x: 0, y: 0 },
            images: { test: imageData },
            animation: [],
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<MovementHandler {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });

    it('should dispatch setIdleTarget when there are no detections', () => {
        jest.useFakeTimers();
        const wrapper = shallow(<MovementHandler {...props} />);
        wrapper.setProps({
            detections: [],
        });
        jest.advanceTimersByTime(1);
        expect(mockSetIdleTargets).toBeCalled();
    });
});
