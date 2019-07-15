import { mount, shallow } from 'enzyme';
import React from 'react';
import { HelpWith } from '../../../components/configMenu/Help';
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
            configName: 'test',
            color: '#cbcbcb',
            onInputChange: mockOnInputChange,
            helpWith: HelpWith.IRIS_COLOUR,
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
        expect(mockOnInputChange).toHaveBeenCalledTimes(1);
    });
});
