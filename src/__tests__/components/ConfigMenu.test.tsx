import { mount, shallow } from 'enzyme';
import jsdom from 'jsdom';
import React from 'react';
import ConfigMenu, {
    IConfigMenuProps,
} from '../../components/configMenu/ConfigMenu';
import TextBoxMenuItem, {
    ITextBoxMenuItemProps,
} from '../../components/configMenu/menuItems/TextBoxMenuItem';

let props: IConfigMenuProps;
let textBoxProps: ITextBoxMenuItemProps;
let children: React.ReactNode;
let window: Window;
let map: { [key: string]: any };

describe('ConfigMenu', () => {
    beforeEach(() => {
        map = {};
        textBoxProps = {
            name: 'textBox',
            defaultValue: 'test',
            isValidInput: jest.fn(),
            onValidInput: jest.fn(),
            parse: jest.fn(),
        };
        children = <TextBoxMenuItem {...textBoxProps} />;

        window = new jsdom.JSDOM().window;
        window.addEventListener = jest.fn((event, cb) => {
            map[event] = cb;
        });
        props = {
            width: '15',
            timerLength: 1,
            children,
            window,
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<ConfigMenu {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });

    it('should set mousemove listener on mount', () => {
        mount(<ConfigMenu {...props} />);
        expect(map).toHaveProperty('mousemove');
    });

    it('should call onMouseMove', () => {
        const wrapper = mount(<ConfigMenu {...props} />);
        wrapper.simulate('mousemove');
        expect(wrapper.state('isUnderMouse')).toBe(true);
    });

    it('should call onMouseLeave', () => {
        const wrapper = mount(<ConfigMenu {...props} />);
        wrapper.simulate('mousemove');
        expect(wrapper.state('isUnderMouse')).toBe(true);
        wrapper.simulate('mouseleave');
        expect(wrapper.state('isUnderMouse')).toBe(false);
    });
});
