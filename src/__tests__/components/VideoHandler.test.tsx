import { shallow } from 'enzyme';
import React from 'react';
import {
    VideoHandler,
    VideoHandlerProps,
} from '../../components/video/VideoHandler';
import { testDevice1, testDevice2 } from '../reducers/video/videoReducer.test';

let props: VideoHandlerProps;

describe('Video handler', () => {
    beforeEach(() => {
        props = {
            mediaDevices: null,
            deviceIds: [testDevice1, testDevice2],
            configureStream: jest.fn(),
        };
    });

    it('Component should render correctly', () => {
        const wrapper = shallow(<VideoHandler {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });
});
