import { mount, shallow } from 'enzyme';
import jsdom from 'jsdom';
import { wrap } from 'module';
import React from 'react';
import TextBoxMenuItem, {
    ITextBoxMenuItemProps,
} from '../../../components/configMenu/menuItems/TextBoxMenuItem';

let props: ITextBoxMenuItemProps;
let mockIsValidInput: jest.Mock;
let mockParse: jest.Mock;

describe('TextBoxMenuItem tests', () => {
    beforeEach(() => {
        mockIsValidInput = jest.fn();
        mockParse = jest.fn();
        props = {
            name: 'test',
            defaultValue: '30',
            isValidInput: mockIsValidInput,
            onValidInput: jest.fn(),
            parse: mockParse,
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<TextBoxMenuItem {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });

    it('should call isValidInput', () => {
        const value = '25';
        mockIsValidInput.mockReturnValue(false);
        const wrapper = mount(<TextBoxMenuItem {...props} />);
        wrapper.find('input').simulate('change', { target: value });
        expect(wrapper.get(0).props.isValidInput).toBeCalled();
    });

    it('should call onValidInput when input is valid', () => {
        const value = '1';
        mockIsValidInput.mockReturnValue(true);
        const wrapper = mount(<TextBoxMenuItem {...props} />);
        wrapper.find('input').simulate('change', { target: value });
        expect(wrapper.get(0).props.onValidInput).toBeCalled();
    });

    it('onBlur should reset input to last valid value when invalid value has been entered', () => {
        const value = '1';
        mockIsValidInput.mockReturnValue(false);
        mockParse.mockReturnValue(props.defaultValue);
        const wrapper = mount(<TextBoxMenuItem {...props} />);
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('change', { target: { value } });
        wrapper.find('input').simulate('blur');
        expect(wrapper.find('input').props().value).toBe(props.defaultValue);
    });
});
