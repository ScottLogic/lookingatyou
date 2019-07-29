import { shallow } from 'enzyme';
import React from 'react';
import { EyeSide } from '../../AppConstants';
import Eye, { IEyeProps } from '../../components/eye/Eye';
import { getBezier, getEyeShape } from '../../components/eye/EyeController';
import { generateInnerPath } from '../../components/eye/utils/EyeUtils';

const dimension = 500;
const scleraRadius = 100;
const openCoefficient = 0.5;
let props: IEyeProps;

describe('Eye', () => {
    beforeEach(() => {
        props = {
            class: EyeSide.LEFT,
            width: dimension,
            height: dimension,
            irisColor: 'blue',
            scleraRadius,
            irisRadius: 50,
            pupilRadius: 20,
            dilatedCoefficient: 1,
            innerX: 250,
            innerY: 250,
            fps: 10,
            eyeShape: getEyeShape(
                dimension,
                dimension,
                scleraRadius,
                openCoefficient,
            ),
            bezier: getBezier(scleraRadius, openCoefficient),
            reflection: undefined,
            innerPath: generateInnerPath(20, 100),
            irisAdjustment: { scale: 1, angle: 0 },
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<Eye {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });
});
