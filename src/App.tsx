import React from 'react';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import './App.css';
import ConfigMenuElement from './components/configMenu/ConfigMenuElement';
import MovementHandler from './components/intelligentMovement/MovementHandler';
import VideoHandler from './components/video/VideoHandler';
import { IObjectDetector } from './models/objectDetection';
import { loadModel } from './store/actions/detections/actions';
import { IRootStore } from './store/reducers/rootReducer';
<<<<<<< HEAD
import { getWebcamAvailable } from './store/selectors/videoSelectors';
=======
import { getDeviceIds } from './store/selectors/videoSelectors';
import { AppStore } from './store/store';
import CocoSSD from './utils/objectDetection/cocoSSD';
>>>>>>> decomposed Eye component into smaller components
import Posenet from './utils/objectDetection/posenet';

interface IAppState {
    width: number;
    height: number;
}

interface IAppProps {
    environment: Window;
    mediaDevices: MediaDevices | null;
}

interface IAppMapStateToProps {
    model: IObjectDetector | null;
    webcamAvailable: boolean;
}

interface IAppMapDispatchToProps {
    loadModel: (init: () => Promise<IObjectDetector>) => void;
}

type AppProps = IAppProps & IAppMapStateToProps & IAppMapDispatchToProps;

const mapStateToProps = (state: IRootStore): IAppMapStateToProps => {
    return {
        model: state.detectionStore.model,
        webcamAvailable: getWebcamAvailable(state),
    };
};

const mapDispatchToProps = (
    dispatch: ThunkDispatch<IRootStore, void, Action>,
) => {
    return {
        loadModel: () => dispatch(loadModel()),
    };
};

export class App extends React.PureComponent<AppProps, IAppState> {
    constructor(props: AppProps) {
        super(props);

        this.state = {
            width: this.props.environment.innerWidth,
            height: this.props.environment.innerHeight,
        };

        this.updateDimensions = this.updateDimensions.bind(this);
    }

    async componentDidMount() {
        this.props.environment.addEventListener(
            'resize',
            this.updateDimensions,
        );
    }

    componentDidUpdate() {
        if (this.props.webcamAvailable && !this.props.model) {
            this.props.loadModel(Posenet.init);
        }
    }

    componentWillUnmount() {
        this.props.environment.removeEventListener(
            'resize',
            this.updateDimensions,
        );
    }

    updateDimensions() {
        this.setState({
            height: this.props.environment.innerHeight,
            width: this.props.environment.innerWidth,
        });
    }

<<<<<<< HEAD
=======
    onUserMedia() {
        this.setState({
            webcamAvailable: true,
        });
        this.props.loadModel(Posenet.init);
    }

    onUserMediaError() {
        this.setState({ webcamAvailable: false });
    }

>>>>>>> decomposed Eye component into smaller components
    render() {
        return (
            <div className="App">
                <VideoHandler mediaDevices={this.props.mediaDevices} />

                {this.props.webcamAvailable ? (
                    !this.props.model ? (
                        <div className="loading-spinner" />
                    ) : (
                        <div>
                            <MovementHandler
                                document={document}
                                width={this.state.width}
                                height={this.state.height}
                                environment={this.props.environment}
                            />
                        </div>
                    )
                ) : (
                    <div className="Error">
                        No webcam connected. Please connect a webcam and refresh
                    </div>
                )}

                <ConfigMenuElement window={this.props.environment.window} />
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);
