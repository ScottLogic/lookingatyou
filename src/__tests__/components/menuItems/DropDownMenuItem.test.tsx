import { mount, shallow } from 'enzyme';
import React from 'react';
import { HelpWith } from '../../../components/configMenu/Help';
import DropDownMenuItem, {
    IDropDownMenuItemProps,
} from '../../../components/configMenu/menuItems/DropDownMenuItem';

let props: IDropDownMenuItemProps;

describe('NumberMenuItem tests', () => {
    beforeEach(() => {
        props = {
            name: 'test',
            configName: 'test',
            onInputChange: jest.fn(),
            values: ['a', 'b', 'c'],
            defaultValue: 'a',
            helpWith: HelpWith.OUTPUT_STRIDE,
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<DropDownMenuItem {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });

    it('should call onInputChange when input is changed', () => {
        const value = 'b';
        const wrapper = mount(<DropDownMenuItem {...props} />);
        wrapper.find('select').simulate('change', { target: { value } });
        expect(wrapper.get(0).props.onInputChange).toHaveBeenCalled();
    });
});
