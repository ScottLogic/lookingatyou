import { shallow } from 'enzyme';
import React from 'react';
import { Gradients, IGradientsProps } from '../../components/eye/Gradients';

let props: IGradientsProps;

describe('Gradients', () => {
    beforeEach(() => {
        props = {
            irisColor: 'blue',
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<Gradients {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });
});
