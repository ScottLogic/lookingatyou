import { shallow } from 'enzyme';
import React from 'react';
import Throttle from '../../../src/utils/Throttle';
class ComponentClass extends React.Component<{ color: string }> {
    render() {
        return <div id="div" color={this.props.color} />;
    }
}
function ComponentFunction(props: { color: string }) {
    return <div id="div" color={props.color} />;
}

describe('Throttle', () => {
    [ComponentClass, ComponentFunction].forEach(Component => {
        it('should not update more than once in the given period (functional)', () => {
            const Throttled = Throttle(Component, 500);
            const throttled = shallow(<Throttled color="red" />);

            const updateSpy = jest.spyOn(throttled.instance(), 'forceUpdate');

            throttled.setProps({ color: 'green' });
            expect(updateSpy).toHaveBeenCalledTimes(0);

            throttled.setProps({ color: 'purple' });
            expect(updateSpy).toHaveBeenCalledTimes(0);

            setTimeout(() => {
                throttled.setProps({ color: 'red' });
                expect(updateSpy).toHaveBeenCalledTimes(1);

                throttled.setProps({ color: 'blue' });
                expect(updateSpy).toHaveBeenCalledTimes(1);

                setTimeout(() => {
                    throttled.setProps({ color: 'yellow' });
                    expect(updateSpy).toHaveBeenCalledTimes(2);
                }, 1000);
            }, 1000);
        });
    });
});
