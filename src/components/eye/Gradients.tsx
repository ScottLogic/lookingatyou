import React from 'react';

interface IGradientsProps {
    pupilColor: string;
    irisColor: string;
}

export function Gradients(props: IGradientsProps) {
    return (
        <React.Fragment>
            <defs>
                <linearGradient id="prefix__a">
                    <stop offset={'0'} stopColor={props.irisColor} />
                    <stop offset={'1'} stopColor="#79dfee" />
                </linearGradient>

                <linearGradient id="lgrad" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="35%" stopColor={props.irisColor} />
                    <stop offset="75%" stopColor={props.irisColor} />
                    <stop offset="100%" stopColor={'#6d6d6d'} />
                </linearGradient>

                <radialGradient id={'pupilGradient'} cx={'70%'} cy={'35%'}>
                    <stop offset={'0%'} stopColor={'white'} />
                    <stop offset={'50%'} stopColor={props.pupilColor} />
                </radialGradient>

                <radialGradient id={'scleraGradient'} cx={'50%'} cy={'50%'}>
                    <stop offset={'40%'} stopColor={'white'} />
                    <stop offset={'80%'} stopColor={'#F5F5F5'} />
                    <stop offset={'100%'} stopColor={'#DCDCDC'} />
                </radialGradient>

                <radialGradient
                    id="irisGradient"
                    cx={'50%'}
                    cy={'50%'}
                    gradientUnits="objectBoundingBox"
                    spreadMethod="reflect"
                    href={'#lgrad'}
                />

                <radialGradient id="reflection" cx={'70%'} cy={'35%'}>
                    <stop offset={'0%'} stopColor={'white'} opacity={0} />
                    <stop
                        offset={'50%'}
                        stopColor={props.pupilColor}
                        opacity={1}
                    />
                </radialGradient>
            </defs>
        </React.Fragment>
    );
}
