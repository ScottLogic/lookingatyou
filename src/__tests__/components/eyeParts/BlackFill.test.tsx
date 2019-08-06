import { shallow } from 'enzyme';
import React from 'react';
import {
    BlackFill,
    IBlackFillProps,
} from '../../../components/eye/eyeParts/BlackFill';

let props: IBlackFillProps;

describe('Blackfill', () => {
    beforeEach(() => {
        props = {
            leftX: 20,
            scleraRadius: 300,
            width: 1920,
            height: 1080,
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<BlackFill {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });
});
