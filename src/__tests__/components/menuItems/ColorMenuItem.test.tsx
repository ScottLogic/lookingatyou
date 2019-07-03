import { mount, shallow } from 'enzyme';
import React from 'react';
import ColorMenuItem, {
    IColorMenuItemProps,
} from '../../../components/configMenu/menuItems/ColorMenuItem';

let props: IColorMenuItemProps;
let mockOnInputChange: jest.Mock;

describe('TextBoxMenuItem tests', () => {
    beforeEach(() => {
        mockOnInputChange = jest.fn();
        props = {
            name: 'test',
            color: '#cbcbcb',
            onInputChange: mockOnInputChange,
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<ColorMenuItem {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });

    it('should call onInputChange on change event', () => {
        const wrapper = mount(<ColorMenuItem {...props} />);
        wrapper
            .find('input')
            .simulate('change', { target: { value: '#ABABAB' } });
        expect(mockOnInputChange).toBeCalledTimes(1);
    });
});
