import { mount, shallow } from 'enzyme';
import React from 'react';
import { HelpWith } from '../../../components/configMenu/Help';
import ColorMenuItem, {
    IColorMenuItemProps,
} from '../../../components/configMenu/menuItems/ColorMenuItem';

let props: IColorMenuItemProps;
let mockOnInputChange: jest.Mock;

describe('NumberMenuItem tests', () => {
    beforeEach(() => {
        mockOnInputChange = jest.fn();
        props = {
            name: 'test',
            configName: 'test',
            color: '#cbcbcb',
            onInputChange: mockOnInputChange,
            helpWith: HelpWith.IRIS_COLOR,
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<ColorMenuItem {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });
});
