import { Button } from '@material-ui/core';
import convert from 'color-convert';
import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import Popup from 'reactjs-popup';
import { PartialConfig } from '../../../store/actions/config/types';
import { HelpWith } from '../Help';
import './ColorMenuItem.css';

export interface IColorMenuItemProps {
    name: string;
    configName: string;
    onInputChange: (payload: PartialConfig) => void;
    color: string;
    helpWith: HelpWith;
}

const ColorMenuItem = React.memo(
    (props: IColorMenuItemProps) => {
        const [showPopup, setShowPopup] = useState(false);

        function getTextColor(): string {
            const [r, g, b] = convert.hex.rgb(props.color);
            return (r + g + b) / 3 > 127 ? 'black' : 'white';
        }

        function onChange(
            event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        ) {
            setShowPopup(true);
        }

        function handleChangeComplete(color: any) {
            props.onInputChange({
                [props.configName]: color.hex,
            });
        }

        function close(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
            setShowPopup(false);
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
                    onClick={onChange}
                    className="launchColorPicker"
                >
                    Pick {props.name}
                </Button>

                {showPopup && (
                    <Popup
                        className="colorPicker"
                        open={showPopup}
                        modal={true}
                        closeOnDocumentClick={false}
                    >
                        <>
                            <SketchPicker
                                color={props.color}
                                onChangeComplete={handleChangeComplete}
                            />

                            <br />

                            <Button
                                className="closeColorPicker"
                                variant="contained"
                                onClick={close}
                            >
                                Close
                            </Button>
                        </>
                    </Popup>
                )}
            </div>
        );
    },
    (previous, next) => previous.color === next.color,
);

export default ColorMenuItem;
