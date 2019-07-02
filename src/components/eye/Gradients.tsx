import React from 'react';
import tinycolor from 'tinycolor2';
import './Gradients.css';

interface IGradientsProps {
    pupilColor: string;
    irisColor: string;
}

const lighterFactor = 30;
const darkerFactor = 13;

export function Gradients(props: IGradientsProps) {
    const darkIrisColor = tinycolor(props.irisColor)
        .darken(darkerFactor)
        .toHexString();
    const lightIrisColor = tinycolor(props.irisColor)
        .brighten(lighterFactor)
        .toHexString();

    return (
        <svg className={'collapse'}>
            <defs>
                <linearGradient id="lgrad" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="35%" stopColor={props.irisColor} />
                    <stop offset="70%" stopColor={lightIrisColor} />
                    <stop offset="100%" stopColor={darkIrisColor} />
                </linearGradient>

                <radialGradient id={'scleraGradient'} cx={'50%'} cy={'50%'}>
                    <stop offset={'0%'} stopColor={'white'} />
                    <stop
                        offset={'85%'}
                        stopColor={tinycolor('white')
                            .darken(10)
                            .toHexString()}
                    />
                    <stop
                        offset={'100%'}
                        stopColor={tinycolor('white')
                            .darken(30)
                            .toHexString()}
                    />
                </radialGradient>

                <radialGradient
                    id="irisGradient"
                    cx={'50%'}
                    cy={'50%'}
                    href={'#lgrad'}
                />

                <radialGradient id="reflectionGradient">
                    <stop offset="0%" stopColor={'white'} stopOpacity={1} />
                    <stop offset="20%" stopColor={'white'} stopOpacity={0.7} />
                    <stop offset="40%" stopColor={'white'} stopOpacity={0.05} />
                </radialGradient>
            </defs>
        </svg>
    );
}
