import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IRootStore } from '../../store/reducers/rootReducer';
import { getVideos } from '../../store/selectors/videoSelectors';
import { IObjectDetector } from '../../utils/interfaces';
import CocoSSD from '../../utils/objectDetection/cocoSSD';
import { DetectionConfig, ModelConfig } from '../../utils/types';

const SET_MODEL_LOADED = 'set_model_loaded';

interface IDetectionHandlerProps {
    FPS: number;
    modelConfig: ModelConfig;
    detectionConfig: DetectionConfig;
}

interface IStateProps {
    videos: Array<HTMLVideoElement | undefined>;
}

interface IDispatchProps {
    setModelLoaded: { type: string; hasLoaded: boolean };
}

export type DetectionHandlerProps = IDetectionHandlerProps &
    IStateProps &
    IDispatchProps;

export class DetectionHandler extends React.Component<DetectionHandlerProps> {
    private model: IObjectDetector | null;
    constructor(props: DetectionHandlerProps) {
        super(props);
        this.model = null;
    }

    async componentDidMount() {
        this.model = await CocoSSD.init(this.props.modelConfig);
    }

    render() {
        return null;
    }
}

const mergeStateToProps = (state: IRootStore) => {
    return { videos: getVideos(state) };
};

const mergeDispatchToProps = (dispatch: Dispatch) => {
    return {
        setModelLoaded: dispatch({ type: SET_MODEL_LOADED, hasLoaded: true }),
    };
};

export default connect(
    mergeStateToProps,
    mergeDispatchToProps,
)(DetectionHandler);
