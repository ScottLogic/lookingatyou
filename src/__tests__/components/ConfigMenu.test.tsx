import { mount, shallow } from 'enzyme';
import jsdom from 'jsdom';
import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
    ConfigMenu,
    ConfigMenuProps,
} from '../../components/configMenu/ConfigMenu';
import {
    initialAdvancedConfig,
    initialAppConfig,
    initialConfig,
} from '../../store/reducers/configReducer';

let props: ConfigMenuProps;
let window: Window;
let map: { [key: string]: any };
let store: Store;

describe('ConfigMenu', () => {
    beforeEach(() => {
        map = {};

        window = new jsdom.JSDOM().window;
        window.addEventListener = jest.fn((event, cb) => {
            map[event] = cb;
        });

        const mockStore = configureStore([thunk]);
        store = mockStore(initialConfig);

        props = {
            window,
            appConfig: initialAppConfig,
            advancedConfig: initialAdvancedConfig,
            updateAppConfig: jest.fn(),
            updateModelConfig: jest.fn(),
            updateDetectionConfig: jest.fn(),
            resetConfig: jest.fn(),
        };
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
