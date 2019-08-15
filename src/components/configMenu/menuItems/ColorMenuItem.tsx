import { Button } from '@material-ui/core';
import convert from 'color-convert';
import React from 'react';
import { HelpWith } from '../Help';
import './ColorMenuItem.css';

export interface IColorMenuItemProps {
    name: string;
    configName: string;
    onClick: () => void;
    color: string;
    helpWith: HelpWith;
}

const ColorMenuItem = React.memo(
    (props: IColorMenuItemProps) => {
        function getTextColor(): string {
            const [r, g, b] = convert.hex.rgb(props.color);
            return (r + g + b) / 3 > 127 ? 'black' : 'white';
        }

        return (
            <div data-tip={true} data-for={HelpWith[props.helpWith]}>
                <Button
                    style={{
                        backgroundColor: props.color,
                        color: props.color ? getTextColor() : 'white',
                    }}
                    value={props.color}
                    variant="contained"
                    onClick={props.onClick}
                    className="launchColorPicker"
                >
                    Pick {props.name}
                </Button>
            </div>
        );
    },
    (previous, next) => previous.color === next.color,
);

export default ColorMenuItem;
