import React from 'react';
import { eyelidPosition } from '../../AppConstants';

interface IShadowsProps {
    openCoefficient: number;
}

export function Shadows(props: IShadowsProps) {
    return (
        <svg>
            <defs>
                <filter id="shadowTop">
                    <feDropShadow
                        dx="0"
                        dy="20"
                        stdDeviation="20"
                        floodColor="#333333"
                    />
                </filter>
                <filter id="shadowBottom">
                    <feDropShadow
                        dx="0"
                        dy={
                            props.openCoefficient === eyelidPosition.CLOSED
                                ? 10
                                : -5
                        }
                        stdDeviation="15"
                        floodColor="#333333"
                    />
                </filter>
            </defs>
        </svg>
    );
}
