import React from 'react';
import { eyelidPosition } from '../../AppConstants';

export interface IShadowsProps {
    openCoefficient: number;
}

export const Shadows = React.memo(
    (props: IShadowsProps) => {
        return (
            <svg className="collapse">
                <defs>
                    <filter id="shadowTop">
                        <feDropShadow
                            dx="0"
                            dy={
                                (0.05 * props.openCoefficient) /
                                eyelidPosition.OPEN
                            }
                            stdDeviation={
                                (0.05 * props.openCoefficient) /
                                eyelidPosition.OPEN
                            }
                            floodColor="#000000"
                            floodOpacity={0.8}
                        />
                    </filter>
                    <filter id="shadowBottom">
                        <feDropShadow
                            dx="0"
                            dy={
                                (-0.0125 * props.openCoefficient) /
                                eyelidPosition.OPEN
                            }
                            stdDeviation={
                                (0.0375 * props.openCoefficient) /
                                eyelidPosition.OPEN
                            }
                            floodColor="#000000"
                            floodOpacity={0.8}
                        />
                    </filter>
                </defs>
            </svg>
        );
    },
    (previous, next) => previous.openCoefficient === next.openCoefficient,
);
