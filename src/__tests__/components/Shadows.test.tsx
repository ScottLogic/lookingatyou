import { shallow } from 'enzyme';
import React from 'react';
import { IShadowsProps, Shadows } from '../../components/eye/Shadows';

let props: IShadowsProps;

describe('Eye Controller', () => {
    beforeEach(() => {
        props = {
            openCoefficient: 1,
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<Shadows {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });
});
