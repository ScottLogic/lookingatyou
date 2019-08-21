import { Button } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import Popup from 'reactjs-popup';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { updateConfigAction } from '../../store/actions/config/actions';
import { ConfigSetAction } from '../../store/actions/config/types';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getShowHelp } from '../../store/selectors/configSelectors';
import { IConfigMenuProps } from '../configMenu/ConfigMenu';
import './HelpPopup.css';

interface IHelpPopupProps {
    window: Window;
}

interface IHelpPopupMapStateToProps {
    showHelp: boolean;
}

interface IHelpPopupMapDispatchToProps {
    setShowHelpToFalse: () => void;
}

type HelpPopupProps = IHelpPopupProps &
    IHelpPopupMapStateToProps &
    IHelpPopupMapDispatchToProps;

function HelpPopup(props: HelpPopupProps) {
    return (
        <Popup
            open={props.showHelp}
            modal={true}
            onClose={props.setShowHelpToFalse}
            closeOnDocumentClick={false}
            closeOnEscape={false}
        >
            {close => (
                <>
                    <h1>Looking At You</h1>
                    This is an app designed to track users using a webcam. The
                    eyes will follow you around and react differently depending
                    on what they see. Hover over any of the menu items for more
                    information. Click the Help button to see this message
                    again.
                    <br />
                    <br />
                    <a
                        href="https://blog.scottlogic.com/2019/08/19/LookingAtYou.html"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Developed by interns at Scott Logic
                    </a>
                    <br />
                    <Button
                        variant="contained"
                        className="accept"
                        onClick={close}
                    >
                        Close
                    </Button>
                </>
            )}
        </Popup>
    );
}

const mapStateToProps = (state: IRootStore): IHelpPopupMapStateToProps => ({
    showHelp: getShowHelp(state),
});

const mapDispatchToProps = (
    dispatch: ThunkDispatch<IRootStore, void, Action>,
    ownProps: IConfigMenuProps,
) => ({
    setShowHelpToFalse: () =>
        dispatch(
            updateConfigAction(
                ConfigSetAction.APP,
                { showHelp: false },
                ownProps.window,
            ),
        ),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(HelpPopup);
