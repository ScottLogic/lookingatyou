import React from 'react';
import { fadeInText } from './FadeInConstants';
import './fadeInText.css';

interface IFadeInTextProps {
    text: string;
    show: boolean;
}

const FadeInText = React.memo((props: IFadeInTextProps) => {
    const style = {
        opacity: props.show ? 1 : 0,
        transition: `opacity ${fadeInText.transitionTime}ms`,
        transitionDelay: `${fadeInText.delay}ms`,
        transitionTimingFunction: 'ease',
    };

    function getFontSize(text: string) {
        if (text.length > fadeInText.defaultTextLength) {
            const scaledFontSize =
                (parseInt(fadeInText.fontSize, 10) *
                    fadeInText.defaultTextLength) /
                text.length;
            return { fontSize: scaledFontSize + 'em' };
        }
        return { fontSize: fadeInText.fontSize };
    }

    return (
        <div className="revealText" style={getFontSize(props.text)}>
            <span style={style}>{props.text}</span>
        </div>
    );
});

export default FadeInText;
