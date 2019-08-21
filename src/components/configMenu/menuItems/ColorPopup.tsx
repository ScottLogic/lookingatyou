import { Button } from '@material-ui/core';
import React from 'react';
import { SketchPicker } from 'react-color';
import Popup from 'reactjs-popup';
import { PartialConfig } from '../../../store/actions/config/types';

interface IColorPopup {
    showPopup: boolean;
    color: string;
    configName: string;
    onInputChange: (payload: PartialConfig) => void;
    close: () => void;
}

const ColorPopup = (props: IColorPopup) => {
    function handleChangeComplete(color: any) {
        props.onInputChange({
            [props.configName]: color.hex,
        });
    }

    return (
        <Popup
            className="colorPicker"
            open={props.showPopup}
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
                    onClick={props.close}
                >
                    Close
                </Button>
            </>
        </Popup>
    );
};

export default ColorPopup;
