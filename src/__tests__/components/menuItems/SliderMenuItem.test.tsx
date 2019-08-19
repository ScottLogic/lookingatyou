import { shallow } from 'enzyme';
import React from 'react';
import { HelpWith } from '../../../components/configMenu/Help';
import SliderMenuItem from '../../../components/configMenu/menuItems/SliderMenuItem';

const props = {
    name: 'test',
    defaultValue: 30,
    onValidInput: jest.fn(),
    configName: 'test',
    step: 1,
    min: 1,
    helpWith: HelpWith.X_SENSITIVITY,
};

it('should render correctly', () => {
    const wrapper = shallow(<SliderMenuItem {...props} />).debug();
    expect(wrapper).toMatchSnapshot();
});
