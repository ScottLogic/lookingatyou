import { mount, shallow } from 'enzyme';
import React from 'react';
import {
    InnerEye,
    InnerEyeProps,
} from '../../../components/eye/eyeParts/InnerEye';

let props: InnerEyeProps;

const data = new Uint8ClampedArray(400);

for (let i = 0; i < 400; i += 4) {
    data[i + 0] = 190; // R value
    data[i + 1] = 0; // G value
    data[i + 2] = 210; // B value
    data[i + 3] = 255; // A value
}

const imageData = { data, width: 10, height: 10 };

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
