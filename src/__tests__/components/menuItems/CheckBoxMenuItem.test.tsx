import { mount, shallow } from 'enzyme';
import React from 'react';
import { HelpWith } from '../../../components/configMenu/Help';
import CheckBoxMenuItem, {
    ICheckBoxMenuItemProps,
} from '../../../components/configMenu/menuItems/CheckBoxMenuItem';

let props: ICheckBoxMenuItemProps;
let mockOnInputChange: jest.Mock;

describe('CheckBoxMenuItem tests', () => {
    beforeEach(() => {
        mockOnInputChange = jest.fn();
        props = {
            name: 'test',
            configName: 'test',
            checked: false,
            onInputChange: mockOnInputChange,
            helpWith: HelpWith.ADV_DEBUG,
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<CheckBoxMenuItem {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });

    it('should call onInputChange on change event', () => {
        const wrapper = mount(<CheckBoxMenuItem {...props} />);
        wrapper.find('input').simulate('change', { target: { value: true } });
        expect(mockOnInputChange).toHaveBeenCalledTimes(1);
    });
});
