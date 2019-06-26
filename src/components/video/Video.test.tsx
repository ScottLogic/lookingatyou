import { mount, shallow } from 'enzyme';
import React from 'react';
import { Video, VideoProps } from './Video';

let props: VideoProps;

describe('Video component tests', () => {
    beforeEach(() => {
        props = {
            deviceId: 'testDevice',
            width: 100,
            height: 100,
            stream: (jest.fn() as unknown) as MediaStream,
            setVideo: jest.fn(),
        };
    });

    it('Component should render correctly', () => {
        const wrapper = shallow(<Video {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });

    it('Component should dispatch SET_VIDEO action', () => {
        mount(<Video {...props} />);
        expect(props.setVideo).toHaveBeenCalled();
    });
});
