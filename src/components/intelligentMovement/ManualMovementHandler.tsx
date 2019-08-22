import { throttle } from 'lodash';
import React, { useEffect, useState } from 'react';
import { eyelidPosition, pupilSizes } from '../../AppConstants';
import { initialAppConfig } from '../../store/reducers/configReducer';
import { normalise } from '../../utils/objectTracking/calculateFocus';
import EyeController from '../eye/EyeController';

interface IManualMovementHandlerProps {
    width: number;
    height: number;
    environment: Window;
}

export function ManualMovementHandler(props: IManualMovementHandlerProps) {
    const [target, setTarget] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const mouseMoveHandler = (ev: MouseEvent) => {
            const x =
                -normalise(ev.clientX, props.width) *
                initialAppConfig.xSensitivity;
            const y =
                normalise(ev.clientY, props.height) *
                initialAppConfig.ySensitivity;
            setTarget({ x, y });
        };

        const throttledMouseMoveHandler = throttle(
            mouseMoveHandler,
            initialAppConfig.fps,
        );

        props.environment.addEventListener(
            'mousemove',
            throttledMouseMoveHandler,
        );

        props.environment.document.body.style.cursor = 'default';

        return () => {
            props.environment.removeEventListener(
                'mousemove',
                throttledMouseMoveHandler,
            );
        };
    }, [props.environment, props.width, props.height]);

    return (
        <EyeController
            {...props}
            dilation={pupilSizes.neutral}
            openCoefficient={eyelidPosition.OPEN}
            detected={false}
            isSleeping={false}
            target={target} // overwrite redux store
            appConfig={initialAppConfig} // overwrite redux store (for constant fps and sensitivity)
        />
    );
}
