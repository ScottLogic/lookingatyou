import React from 'react';
import { fadeInText } from '../../AppConstants';
import { normalise } from '../../utils/objectTracking/calculateFocus';
import './fadeInText.css';

interface ITextProps {
    text: string;
    show: boolean;
}

const FadeInText = React.memo((props: ITextProps) => {
    function renderSpans(text: string) {
        const textArray = text.split('');

        const delays = [...new Array(textArray.length)].map(() =>
            normalise(
                Math.random(),
                1,
                0,
                fadeInText.delayMax,
                fadeInText.delayMin,
            ),
        );

        const combineWithDelays = (character: string, index: number) => ({
            character,
            delay: delays[index],
        });

        return textArray.map(combineWithDelays).map(renderToSpan);
    }

    function renderToSpan(
        characterProps: { character: string; delay: number },
        index: number,
    ) {
        const transitionTime = normalise(
            Math.random(),
            1,
            0,
            fadeInText.transitionMax,
            fadeInText.transitionMin,
        );
        const style = {
            opacity: props.show ? 1 : 0,
            transition: `opacity ${transitionTime}ms`,
            transitionDelay: `${characterProps.delay}ms`,
            transitionTimingFunction: 'linear',
        };
        return (
            <span style={style} key={index}>
                {characterProps.character}
            </span>
        );
    }

    return <div className="revealText">{renderSpans(props.text)}</div>;
});

export default FadeInText;
