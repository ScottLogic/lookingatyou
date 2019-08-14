import { shallow } from 'enzyme';
import React from 'react';
import { HelpWith } from '../../../components/configMenu/Help';
import {
    CanvasMenuItem,
    CanvasMenuItemProps,
} from '../../../components/configMenu/menuItems/CanvasMenuItem';

let props: CanvasMenuItemProps;

describe('CanvasMenuItem', () => {
    beforeEach(() => {
        props = {
            name: 'test',
            videoIndex: 0,
            helpWith: HelpWith.ADV_DEBUG,
            video: undefined,
            selection: undefined,
            detections: [],
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<CanvasMenuItem {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });
});
