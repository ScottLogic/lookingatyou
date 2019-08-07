import { shallow } from 'enzyme';
import React from 'react';
import SliderMenuItem, {
    ISliderMenuItemProps,
} from '../../../components/configMenu/menuItems/SliderMenuItem';

let props: ISliderMenuItemProps;

it('should render correctly', () => {
    const wrapper = shallow(<SliderMenuItem {...props} />).debug();
    expect(wrapper).toMatchSnapshot();
});
