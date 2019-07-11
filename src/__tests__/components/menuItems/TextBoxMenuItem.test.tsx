import { mount, shallow } from 'enzyme';
import React from 'react';
import Help, { HelpWith } from '../../../components/configMenu/Help';
import TextBoxMenuItem, {
    ITextBoxMenuItemProps,
} from '../../../components/configMenu/menuItems/TextBoxMenuItem';

let props: ITextBoxMenuItemProps;
let mockParse: jest.Mock;

describe('TextBoxMenuItem tests', () => {
    beforeEach(() => {
        mockParse = jest.fn();
        props = {
            name: 'test',
            defaultValue: '30',
            onValidInput: jest.fn(),
            configName: 'test',
            validRegex: /^[0-9]+$/,
            configParse: jest.fn(),
            helpWith: HelpWith.FPS,
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<TextBoxMenuItem {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });

    it('should call onValidInput when input is valid', () => {
        const value = '5';
        const wrapper = mount(<TextBoxMenuItem {...props} />);
        wrapper.find('input').simulate('change', { target: { value } });
        expect(wrapper.get(0).props.onValidInput).toHaveBeenCalled();
    });

    it('onBlur should reset input to last valid value when invalid value has been entered', () => {
        const value = 'test';
        mockParse.mockReturnValue(props.defaultValue);
        const wrapper = mount(<TextBoxMenuItem {...props} />);
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('change', { target: { value } });
        wrapper.find('input').simulate('blur');
        expect(wrapper.find('input').props().value).toBe(props.defaultValue);
    });
});
