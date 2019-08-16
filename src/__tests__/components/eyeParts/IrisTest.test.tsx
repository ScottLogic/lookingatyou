import { shallow } from 'enzyme';
import React from 'react';
import Iris, {
    IIrisProps,
} from '../../../components/eye/eyeParts/innerParts/Iris';

let props: IIrisProps;
const data = new Uint8ClampedArray(400);
const animation = {
    target: { x: 0, y: 0 },
    dilation: 1,
    openCoefficient: 1,
    irisColor: 'blue',
    duration: 100,
};

for (let i = 0; i < 400; i += 4) {
    data[i + 0] = 190; // R value
    data[i + 1] = 0; // G value
    data[i + 2] = 210; // B value
    data[i + 3] = 255; // A value
}

const imageData = { data, width: 10, height: 10 };

describe('Iris', () => {
    beforeEach(() => {
        props = {
            height: 800,
            width: 1000,
            scleraRadius: 500,
            irisRadius: 200,
            pupilRadius: 100,
            animation,
            reflection: imageData,
            innerPath: '',
            skewTransform: '',
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(<Iris {...props} />).debug();
        expect(wrapper).toMatchSnapshot();
    });
});
