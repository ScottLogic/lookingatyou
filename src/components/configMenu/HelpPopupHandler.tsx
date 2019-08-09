import { Button } from '@material-ui/core';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Popup from 'reactjs-popup';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { updateConfigAction } from '../../store/actions/config/actions';
import { ConfigSetAction } from '../../store/actions/config/types';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getShowHelp } from '../../store/selectors/configSelectors';
import { IConfigMenuProps } from './ConfigMenu';
import './Popup.css';

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
                <Fragment>
                    <h1>Looking At You</h1>
                    <br />
                    This is an app designed to track users using a webcam. The
                    eyes will follow you around and react differently depending
                    on what they see. Hover over any of the menu items for more
                    information. Click the Help (?) icon to see this message
                    again.
                    <br />
                    <Button
                        variant="contained"
                        color="primary"
                        className="accept"
                        onClick={close}
                    >
                        Close
                    </Button>
                </Fragment>
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
