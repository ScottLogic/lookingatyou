import { mount, shallow } from 'enzyme';
import React from 'react';
import { HelpWith } from '../../../components/configMenu/Help';
import DropDownMenuItem, {
    IDropDownMenuItemProps,
} from '../../../components/configMenu/menuItems/DropDownMenuItem';

let props: IDropDownMenuItemProps;

describe('DropDownMenuItem', () => {
    beforeEach(() => {
        props = {
            name: 'test',
            configName: 'test',
            onInputChange: jest.fn(),
            values: ['a', 'b', 'c'],
            defaultValue: 'a',
            helpWith: HelpWith.OUTPUT_STRIDE,
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<DropDownMenuItem {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });
});
