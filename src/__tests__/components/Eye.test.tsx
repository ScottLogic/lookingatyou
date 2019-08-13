import { shallow } from 'enzyme';
import React from 'react';
import { EyeSide } from '../../AppConstants';
import Eye, { IEyeProps } from '../../components/eye/Eye';
import { getBezier, getEyeShape } from '../../components/eye/EyeController';
import { generateInnerPath } from '../../components/eye/utils/VisualUtils';

const dimension = 500;
const scleraRadius = 100;
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
            width: dimension,
            height: dimension,
            scleraRadius,
            irisRadius: 50,
            pupilRadius: 20,
            eyeShape: getEyeShape(
                dimension,
                dimension,
                scleraRadius,
                openCoefficient,
            ),
            bezier: getBezier(scleraRadius, openCoefficient),
            reflection: undefined,
            innerPath: generateInnerPath(20, 100),
            skewTransform: '',
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<Eye {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });
});
