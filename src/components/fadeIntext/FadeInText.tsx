import React from 'react';
import './fadeInText.css';

interface ITextProps {
    text: string;
    show: boolean;
}

const FadeInText = React.memo((props: ITextProps) => {
    function renderSpans(text: string) {
        const textArray = text.split('');

        const delays = getDelays(textArray.length);
        const combineWithDelays = (character: string, index: number) => ({
            character,
            delay: delays[index],
        });

        return textArray.map(combineWithDelays).map(renderToSpan);
    }

    function renderToSpan(
        { character, delay }: any,
        index: string | number | undefined,
    ) {
        const transitionTime = Math.random() * (2000 - 200) + 200;
        const timingFunction = 'linear';
        const style = {
            opacity: props.show ? 1 : 0,
            transition: `opacity ${transitionTime}ms`,
            transitionDelay: `${delay}ms`,
            transitionTimingFunction: timingFunction,
        };
        return (
            <span style={style} key={index}>
                {character}
            </span>
        );
    }

    function getDelays(length: number) {
        const threshold = 0.2;
        const delayMin = 100;
        const delayMax = 500;

        const randoms = () => getRandoms(length, threshold);
        const toDelay = (num: number) => randomToDelay(num, delayMin, delayMax);

        return randoms().map(toDelay);
    }

    return <div className="revealText">{renderSpans(props.text)}</div>;
});

export default FadeInText;

const getRandoms = (length: number, threshold: number) => {
    const tooClose = (a: number, b: number) => Math.abs(a - b) < threshold;

    const result = [];
    let random;

    for (let i = 0; i < length; i += 1) {
        random = Math.random();
        if (i !== 0) {
            const prev = result[i - 1];
            while (tooClose(random, prev)) {
                random = Math.random();
            }
        }
        result.push(random);
    }
    return result;
};

const randomToDelay = (random: number, min: number, max: number) => {
    const float = random * (max - min);
    return Math.round(float) + min;
};
