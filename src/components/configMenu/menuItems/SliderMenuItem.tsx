import { Slider, Tooltip } from '@material-ui/core';
import React from 'react';
import { PartialConfig } from '../../../store/actions/config/types';
import { HelpWith } from '../Help';

function ValueLabelComponent(props: any) {
    const { children, open, value } = props;
    const popperRef: any = React.useRef(null);

    React.useEffect(() => {
        if (popperRef.current) {
            popperRef.current!.update();
        }
    });

    return (
        <Tooltip
            PopperProps={{
                popperRef,
            }}
            open={open}
            enterTouchDelay={0}
            placement="top"
            title={value}
        >
            {children}
        </Tooltip>
    );
}

export interface ISliderMenuItemProps {
    name: string;
    configName: string;
    step: number;
    min?: number;
    max?: number;
    onValidInput: (payload: PartialConfig) => void;
    defaultValue: number;
    helpWith: HelpWith;
}

const SliderMenuItem = React.memo(
    (props: ISliderMenuItemProps) => {
        function onChange(ignore: object, value: number | number[]) {
            props.onValidInput({
                [props.configName]: value,
            });
        }

        return (
            <div data-tip={true} data-for={HelpWith[props.helpWith]}>
                <label>{props.name}</label>
                <Slider
                    ValueLabelComponent={ValueLabelComponent}
                    aria-label="custom thumb label"
                    defaultValue={props.defaultValue}
                    value={props.defaultValue}
                    onChange={onChange}
                    min={props.min}
                    max={props.max}
                    step={props.step}
                    className="slider"
                />
            </div>
        );
    },
    (previous, next) => {
        return (
            previous.name === next.name &&
            previous.defaultValue === next.defaultValue
        );
    },
);
export default SliderMenuItem;
