import { shallow } from 'enzyme';
import React from 'react';
import { IScleraProps, Sclera } from '../../../components/eye/eyeParts/Sclera';

let props: IScleraProps;

describe('Sclera', () => {
    beforeEach(() => {
        props = {
            radius: 100,
            width: 1000,
            height: 800,
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<Sclera {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });
});
