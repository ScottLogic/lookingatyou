import { mount, shallow } from 'enzyme';
import jsdom from 'jsdom';
import React from 'react';
import ConfigMenu, {
    IConfigMenuProps,
} from '../../components/configMenu/ConfigMenu';
import { HelpWith } from '../../components/configMenu/Help';
import NumberMenuItem, {
    INumberMenuItemProps,
} from '../../components/configMenu/menuItems/NumberMenuItem';

let props: IConfigMenuProps;
let textBoxProps: INumberMenuItemProps;
let children: React.ReactNode;
let window: Window;
let map: { [key: string]: any };

describe('ConfigMenu', () => {
    beforeEach(() => {
        map = {};
        textBoxProps = {
            name: 'textBox',
            configName: 'textBox',
            defaultValue: 20,
            onValidInput: jest.fn(),
            helpWith: HelpWith.FPS,
            min: 1,
            step: 1,
        };
        children = <NumberMenuItem {...textBoxProps} />;

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

    it('should call mouseMoveHandler', () => {
        const wrapper = mount(<ConfigMenu {...props} />);
        wrapper.simulate('mousemove');
        expect(wrapper.state('isUnderMouse')).toBe(false);
    });

    it('should call onMouseLeave', () => {
        const wrapper = mount(<ConfigMenu {...props} />);
        wrapper.simulate('mouseenter');
        expect(wrapper.state('isUnderMouse')).toBe(true);
        wrapper.simulate('mouseleave');
        expect(wrapper.state('isUnderMouse')).toBe(false);
    });
});
