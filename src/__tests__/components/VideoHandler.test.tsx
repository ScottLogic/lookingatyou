import { shallow } from 'enzyme';
import React from 'react';
import {
    VideoHandler,
    VideoHandlerProps,
} from '../../components/video/VideoHandler';

let props: VideoHandlerProps;

describe('Video handler', () => {
    beforeEach(() => {
        props = {
            mediaDevices: null,
            configureStream: jest.fn(),
            webcamAvailable: true,
        };
    });

    it('Component should render correctly', () => {
        const wrapper = shallow(<VideoHandler {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });
});
