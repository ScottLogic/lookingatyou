import { shallow } from 'enzyme';
import React from 'react';
import { EyeSide } from '../../AppConstants';
import Eye, { IEyeProps } from '../../components/eye/Eye';

let props: IEyeProps;

describe('Eye', () => {
    beforeEach(() => {
        props = {
            class: EyeSide.LEFT,
            width: 500,
            height: 500,
            irisColor: 'blue',
            scleraRadius: 100,
            irisRadius: 50,
            pupilRadius: 20,
            openCoefficient: 0.5,
            dilatedCoefficient: 1,
            innerX: 250,
            innerY: 250,
            fps: 10,
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<Eye {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });
});
