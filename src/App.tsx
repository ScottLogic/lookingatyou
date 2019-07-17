import { PoseNet } from '@tensorflow-models/posenet';
import React from 'react';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import './App.css';
import ConfigMenuElement from './components/configMenu/ConfigMenuElement';
import MovementHandler from './components/intelligentMovement/MovementHandler';
import VideoHandler from './components/video/VideoHandler';
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
            this.props.loadModel();
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
                                width={this.state.width}
                                height={this.state.height}
                                environment={this.props.environment}
                            />
                        </div>
                    )
                ) : (
                    <div className="Error">
                        No webcam connected. Please connect a webcam.
                    </div>
                )}

                <ConfigMenuElement window={this.props.environment.window} />
            </div>
        );
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
    loadModel: () => dispatch(loadModel(ownProps.window.document)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);
