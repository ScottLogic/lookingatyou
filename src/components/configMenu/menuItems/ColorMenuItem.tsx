import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import ReactTooltip from 'react-tooltip';
import Popup from 'reactjs-popup';
import { UpdateConfigAction } from '../../../store/actions/config/types';
import { HelpWith } from '../Help';
import './ColorMenuItem.css';

export interface IColorMenuItemProps {
    name: string;
    configName: string;
    onInputChange: UpdateConfigAction;
    color: string;
    helpWith: HelpWith;
}

const ColorMenuItem = React.memo(
    (props: IColorMenuItemProps) => {
        const [showPopup, setShowPopup] = useState(false);

        function onChange() {
            ReactTooltip.hide();
            setShowPopup(true);
        }

        function handleChangeComplete(color: any) {
            props.onInputChange({
                [props.configName]: color.hex,
            });
        }

        function close() {
            setShowPopup(false);
        }

        return (
            <div data-tip={true} data-for={HelpWith[props.helpWith]}>
                <Button
                    style={{
                        backgroundColor: props.color,
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
                                disableAlpha={true}
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
