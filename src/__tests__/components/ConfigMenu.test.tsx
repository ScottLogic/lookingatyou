import { mount, shallow } from 'enzyme';
import jsdom from 'jsdom';
import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import ConfigMenu, {
    ConfigMenuProps,
    IConfigMenuProps,
} from '../../components/configMenu/ConfigMenu';
import { HelpWith } from '../../components/configMenu/Help';
import NumberMenuItem, {
    INumberMenuItemProps,
} from '../../components/configMenu/menuItems/NumberMenuItem';
import { initialState } from '../../store/reducers/configReducer';
import { createStore } from '../../store/store';

let props: IConfigMenuProps;
let numberProps: INumberMenuItemProps;
let children: React.ReactNode;
let window: Window;
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
let map: { [key: string]: any };
let store: Store;

describe('ConfigMenu', () => {
    beforeEach(() => {
        map = {};
        numberProps = {
            name: 'number',
            configName: 'number',
            defaultValue: 20,
            onValidInput: jest.fn(),
            helpWith: HelpWith.FPS,
            min: 1,
            step: 1,
        };
        children = <NumberMenuItem {...numberProps} />;

        window = new jsdom.JSDOM().window;
        window.addEventListener = jest.fn((event, cb) => {
            map[event] = cb;
        });
        props = {
            window,
        };
        const mockStore = configureStore([thunk]);
        store = mockStore(initialState);
    });

    it('should render correctly', () => {
        const wrapper = shallow(
            <Provider store={store}>
                <ConfigMenu {...props} />
            </Provider>,
        ).debug();
        expect(wrapper).toMatchSnapshot();
    });

    it('should set mousemove listener on mount', () => {
        mount(
            <Provider store={store}>
                <ConfigMenu {...props} />
            </Provider>,
        );
        expect(map).toHaveProperty('mousemove');
    });

    it('should call mouseMoveHandler', () => {
        const wrapper = mount(
            <Provider store={store}>
                <ConfigMenu {...props} />
            </Provider>,
        );
        const child = wrapper.find('ConfigMenu').first();
        child.simulate('mousemove');
        expect(child.state('isUnderMouse')).toBe(false);
    });

    it('should call onMouseLeave', () => {
        const wrapper = mount(
            <Provider store={store}>
                <ConfigMenu {...props} />
            </Provider>,
        );
        const child = wrapper.find('ConfigMenu').first();
        wrapper.simulate('mouseenter');
        expect(child.state('isUnderMouse')).toBe(true);
        wrapper.simulate('mouseleave');
        expect(child.state('isUnderMouse')).toBe(false);
    });
});
