export interface IInnerPartProps {
    transitionStyle: React.CSSProperties;
    pupilRadius: number;
    skewTransform: string;
    groupProps: {
        className: string;
        style: {
            transition: string;
        };
        transform: string;
    };
}
