import { mount, shallow } from 'enzyme';
import React from 'react';
import {
    InnerEye,
    InnerEyeProps,
} from '../../../components/eye/eyeParts/InnerEye';

let props: InnerEyeProps;

describe('InnerEye', () => {
    beforeEach(() => {
        props = {
            irisRadius: 200,
            dilatedCoefficient: 1,
            innerX: 0,
            innerY: 0,
            irisColor: 'blue',
            fps: 30,
            height: 800,
            width: 1000,
            pupilColor: 'black',
            pupilRadius: 100,
            scleraRadius: 500,
            reflectionOpacity: 0.5,
            showReflection: true,
            target: { x: 0, y: 0 },
            innerPath: '',
            image: undefined,
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<InnerEye {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });
});
