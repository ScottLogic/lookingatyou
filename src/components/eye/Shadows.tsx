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
                                (20 * props.openCoefficient) /
                                eyelidPosition.OPEN
                            }
                            stdDeviation={
                                (20 * props.openCoefficient) /
                                eyelidPosition.OPEN
                            }
                            floodColor="#333333"
                        />
                    </filter>
                    <filter id="shadowBottom">
                        <feDropShadow
                            dx="0"
                            dy={
                                (-5 * props.openCoefficient) /
                                eyelidPosition.OPEN
                            }
                            stdDeviation={
                                (15 * props.openCoefficient) /
                                eyelidPosition.OPEN
                            }
                            floodColor="#333333"
                        />
                    </filter>
                </defs>
            </svg>
        );
    },
    (previous, next) => previous.openCoefficient === next.openCoefficient,
);
