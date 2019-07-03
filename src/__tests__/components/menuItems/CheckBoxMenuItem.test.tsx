import { mount, shallow } from 'enzyme';
import React from 'react';
import CheckBoxMenuItem, {
    ICheckBoxMenuItemProps,
} from '../../../components/configMenu/menuItems/CheckBoxMenuItem';

let props: ICheckBoxMenuItemProps;
let mockOnInputChange: jest.Mock;

describe('TextBoxMenuItem tests', () => {
    beforeEach(() => {
        mockOnInputChange = jest.fn();
        props = {
            name: 'test',
            checked: false,
            onInputChange: mockOnInputChange,
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
