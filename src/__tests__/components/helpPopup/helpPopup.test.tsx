import { shallow } from 'enzyme';
import jsdom, { DOMWindow } from 'jsdom';
import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import HelpPopup from '../../../components/helpPopup/HelpPopup';
import { initialConfig } from '../../../store/reducers/configReducer';

describe('HelpPopup', () => {
    let window: DOMWindow;
    let store: Store;
    beforeEach(() => {
        const mockStore = configureStore([thunk]);
        store = mockStore(initialConfig);
        window = new jsdom.JSDOM().window;
    });
    it('should render correctly', () => {
        const wrapper = shallow(
            <Provider store={store}>
                <HelpPopup window={window} />
            </Provider>,
        ).debug();
        expect(wrapper).toMatchSnapshot();
    });
});
