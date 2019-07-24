import React from 'react';
import tinycolor from 'tinycolor2';
import './Gradients.css';

export interface IGradientsProps {
    irisColor: string;
    reflectionOpacity: number;
}

const lighterFactor = 30;
const darkerFactor = 13;

export const Gradients = React.memo(
    (props: IGradientsProps) => {
        const darkIrisColor = tinycolor(props.irisColor)
            .darken(darkerFactor)
            .toHexString();
        const lightIrisColor = tinycolor(props.irisColor)
            .brighten(lighterFactor)
            .toHexString();

        return (
            <svg className="collapse">
                <defs>
                    <linearGradient
                        id="lgrad"
                        x1="0%"
                        y1="50%"
                        x2="100%"
                        y2="50%"
                    >
                        <stop offset="35%" stopColor={props.irisColor} />
                        <stop offset="70%" stopColor={lightIrisColor} />
                        <stop offset="100%" stopColor={darkIrisColor} />
                    </linearGradient>

                    <radialGradient id="scleraGradient" cx="50%" cy="50%">
                        <stop offset="0%" stopColor="white" />
                        <stop offset="20%" stopColor="#f7f7f7" />
                        <stop offset="40%" stopColor="#ebebeb" />
                        <stop offset="60%" stopColor="#e0e0e0" />
                        <stop offset="80%" stopColor="#b3b3b3" />
                        <stop offset="100%" stopColor="#333333" />
                    </radialGradient>

                    <radialGradient
                        id="irisGradient"
                        cx="50%"
                        cy="50%"
                        href="#lgrad"
                    />

                    <radialGradient id="shineGradient">
                        <stop offset="0%" stopColor="white" stopOpacity={1} />
                        <stop
                            offset="20%"
                            stopColor="white"
                            stopOpacity={0.7}
                        />
                        <stop
                            offset="40%"
                            stopColor="white"
                            stopOpacity={0.05}
                        />
                    </radialGradient>

                    <radialGradient id="pupilGradient">
                        <stop
                            offset="0%"
                            stopColor="black"
                            stopOpacity={1 - props.reflectionOpacity}
                        />
                        <stop
                            offset="75%"
                            stopColor="black"
                            stopOpacity={1 - 0.75 * props.reflectionOpacity}
                        />
                        <stop offset="100%" stopColor="black" stopOpacity={1} />
                    </radialGradient>
                </defs>
            </svg>
        );
    },
    (previous, next) =>
        previous.irisColor === next.irisColor &&
        previous.reflectionOpacity === next.reflectionOpacity,
);
