import { throttle, ThrottleSettings } from 'lodash';
import React from 'react';

export default function Throttle<Props>(
    Component: React.ComponentType<Props>,
    wait?: number | undefined,
    options?: ThrottleSettings | undefined,
): React.ComponentType<Props> {
    return class Throttled extends React.Component<Props> {
        updateThrottled = throttle(this.forceUpdate, wait, options);

        shouldComponentUpdate() {
            this.updateThrottled();
            return false;
        }

        componentWillUnmount() {
            this.updateThrottled.cancel();
        }

        render() {
            return <Component {...this.props} />;
        }

        componentWillUpdate() {
            // empty function for spy
        }
    };
}
