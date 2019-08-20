import { shallow } from 'enzyme';
import React from 'react';
import { eyeCoefficients, EyeSide } from '../../AppConstants';
import Eye, { IEyeProps } from '../../components/eye/Eye';
import { getBezier } from '../../components/eye/utils/EyeShapeUtils';
import { generateInnerPath } from '../../components/eye/utils/VisualUtils';

const openCoefficient = 0.5;
let props: IEyeProps;
const animation = {
    target: { x: 250, y: 250 },
    dilation: 1,
    openCoefficient,
    duration: 100,
    irisColor: 'blue',
};

describe('Eye', () => {
    beforeEach(() => {
        props = {
            animation,
            class: EyeSide.LEFT,
            bezier: getBezier(openCoefficient),
            reflection: undefined,
            innerPath: generateInnerPath(eyeCoefficients.iris, 100),
            skewTransform: '',
            openCoefficient,
            reflectionOpacity: 0.2,
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<Eye {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });
});
