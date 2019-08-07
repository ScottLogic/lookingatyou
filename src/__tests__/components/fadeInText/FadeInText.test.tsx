import { shallow } from 'enzyme';
import React from 'react';
import FadeInText from '../../../components/fadeInText/FadeInText';
describe('FadeInText', () => {
    const props = {
        text: 'test',
        show: true,
    };
    it('should render correctly', () => {
        const wrapper = shallow(<FadeInText {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });
});
