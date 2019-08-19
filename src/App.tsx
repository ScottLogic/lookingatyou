import { PoseNet } from '@tensorflow-models/posenet';
import React from 'react';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import './App.css';
import ConfigMenu from './components/configMenu/ConfigMenu';
import HelpPopup from './components/helpPopup/HelpPopup';
import MovementHandler from './components/intelligentMovement/MovementHandler';
import VideoHandler from './components/video/VideoHandler';
import eyeImage from './img/eye.png';
import { loadModel } from './store/actions/detections/actions';
import { IRootStore } from './store/reducers/rootReducer';
import { getWebcamAvailable } from './store/selectors/videoSelectors';

interface IAppState {
    width: number;
    height: number;
}

interface IAppProps {
    environment: Window;
    mediaDevices: MediaDevices | null;
}

interface IAppMapStateToProps {
    model: PoseNet | null;
    webcamAvailable: boolean;
}

interface IAppMapDispatchToProps {
    loadModel: () => void;
}

type AppProps = IAppProps & IAppMapStateToProps & IAppMapDispatchToProps;

export class App extends React.Component<AppProps, IAppState> {
    constructor(props: AppProps) {
        super(props);

        this.state = {
            width: this.props.environment.innerWidth,
            height: this.props.environment.innerHeight,
        };

        this.updateDimensions = this.updateDimensions.bind(this);
        this.setDoShowPopup = this.setDoShowPopup.bind(this);
    }

    async componentDidMount() {
        this.props.environment.addEventListener(
            'resize',
            this.updateDimensions,
        );
        this.handleCursor();
    }

    handleCursor() {
        let mouseTimer: any = null;
        let cursorVisible = true;

        function disappearCursor() {
            mouseTimer = null;
            document.body.style.cursor = 'none';
            cursorVisible = false;
        }

        document.onmousemove = () => {
            if (mouseTimer) {
                window.clearTimeout(mouseTimer);
            }
            if (!cursorVisible) {
                document.body.style.cursor = 'default';
                cursorVisible = true;
            }
            mouseTimer = window.setTimeout(disappearCursor, 1000);
        };
    }

    componentDidUpdate() {
        if (this.props.webcamAvailable && !this.props.model) {
            this.props.loadModel();
        }
    }

    componentWillUnmount() {
        this.props.environment.removeEventListener(
            'resize',
            this.updateDimensions,
        );
    }

    shouldComponentUpdate(nextProps: AppProps, nextState: IAppState) {
        return (
            this.props.webcamAvailable !== nextProps.webcamAvailable ||
            this.props.model !== nextProps.model ||
            this.state.height !== nextState.height ||
            this.state.width !== nextState.width
        );
    }

    updateDimensions() {
        this.setState({
            height: this.props.environment.innerHeight,
            width: this.props.environment.innerWidth,
        });
    }

    render() {
        return (
            <div className="App">
                <VideoHandler {...this.props} />

                {!this.props.webcamAvailable && (
                    <div className="Error">
                        No webcam connected. Please connect a webcam.
                    </div>
                )}

                {this.props.webcamAvailable && !this.props.model && (
                    <div className="spinner">
                        <div className="bounce1">
                            <img src={eyeImage} alt="eye" />
                        </div>
                        <div className="bounce2">
                            <img src={eyeImage} alt="eye" />
                        </div>
                        <div className="bounce3">
                            <img src={eyeImage} alt="eye" />
                        </div>
                    </div>
                )}

                {this.props.webcamAvailable && this.props.model && (
                    <>
                        <HelpPopup window={this.props.environment} />
                        <MovementHandler {...this.state} {...this.props} />
                        <ConfigMenu window={this.props.environment.window} />
                    </>
                )}
            </div>
        );
    }
    private setDoShowPopup() {
        this.props.environment.localStorage.setItem('dontShowPopup', 'true');
    }
}

const mapStateToProps = (state: IRootStore): IAppMapStateToProps => ({
    model: state.detectionStore.model,
    webcamAvailable: getWebcamAvailable(state),
});

const mapDispatchToProps = (
    dispatch: ThunkDispatch<IRootStore, void, Action>,
    ownProps: IAppProps,
) => ({
    loadModel: () => dispatch(loadModel(ownProps.environment)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);
