import { shallow } from 'enzyme';
import React from 'react';
import {
    Eyelids,
    IEyelidsProps,
} from '../../../components/eye/eyeParts/Eyelids';

let props: IEyelidsProps;

describe('Eyelids', () => {
    beforeEach(() => {
        props = {
            transitionStyle: { transition: '' },
            eyeShape: {
                leftX: 0,
                rightX: 0,
                middleY: 0,
                middleX: 0,
                topEyelidY: 0,
                bottomEyelidY: 0,
            },
            cornerShape: {
                leftTop: 0,
                rightTop: 0,
                leftBottom: 0,
                rightBottom: 0,
            },
            scleraRadius: 300,
            bezier: {
                controlOffset: 20,
                scaledXcontrolOffset: 20,
                scaledYcontrolOffset: 30,
            },
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<Eyelids {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });
});
