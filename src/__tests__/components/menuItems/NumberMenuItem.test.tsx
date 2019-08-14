import { mount, shallow } from 'enzyme';
import React from 'react';
import { HelpWith } from '../../../components/configMenu/Help';
import NumberMenuItem, {
    INumberMenuItemProps,
} from '../../../components/configMenu/menuItems/NumberMenuItem';

let props: INumberMenuItemProps;
let mockParse: jest.Mock;

describe('NumberMenuItem tests', () => {
    beforeEach(() => {
        mockParse = jest.fn();
        props = {
            name: 'test',
            defaultValue: 30,
            onValidInput: jest.fn(),
            configName: 'test',
            step: 1,
            min: 1,
            helpWith: HelpWith.APP_FPS,
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<NumberMenuItem {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });

    it('should call onValidInput when input is valid', () => {
        const value = '5';
        const wrapper = mount(<NumberMenuItem {...props} />);
        wrapper.find('input').simulate('change', { target: { value } });
        expect(wrapper.get(0).props.onValidInput).toHaveBeenCalled();
    });

    it('onBlur should reset input to last valid value when invalid value has been entered', () => {
        const value = 'test';
        mockParse.mockReturnValue(props.defaultValue);
        const wrapper = mount(<NumberMenuItem {...props} />);
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('change', { target: { value } });
        wrapper.find('input').simulate('blur');
        expect(wrapper.find('input').props().value).toBe(props.defaultValue);
    });
});
