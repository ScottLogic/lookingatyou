import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    eyelidPosition,
    middleX,
    middleY,
    pupilSizes,
} from '../../AppConstants';
import { IDetection } from '../../models/objectDetection';
import {
    setBright,
    setDetected,
    setDilation,
    setLeft,
    setOpen,
    setSquinting,
    setTarget,
} from '../../store/actions/detections/actions';
import {
    ISetBrightAction,
    ISetDetectionsAction,
    ISetDilationAction,
    ISetLeftAction,
    ISetOpenAction,
    ISetPersonAction,
    ISetSquintAction,
    ISetTargetAction,
} from '../../store/actions/detections/types';
import { IRootStore } from '../../store/reducers/rootReducer';
import { ICoords } from '../../utils/types';
import { analyseLight, checkLight, naturalMovement } from '../eye/EyeUtils';

interface IStateProps {
    detections: IDetection[];
    target: ICoords;
    tooBright: boolean;
    left: boolean;
    personDetected: boolean;
    squinting: boolean;
    openCoefficient: number;
    dilationCoefficient: number;
}

interface IDispatchProps {
    setLeft: (left: boolean) => ISetLeftAction;
    setBright: (tooBright: boolean) => ISetBrightAction;
    setSquinting: (isSquinting: boolean) => ISetSquintAction;
    setOpen: (openCoefficient: number) => ISetOpenAction;
    setDilation: (dilation: number) => ISetDilationAction;
    setDetected: (detected: boolean) => ISetPersonAction;
    setTarget: (targer: ICoords) => ISetTargetAction;
}

export type MovementHandlerProps = IDispatchProps & IStateProps;

export class MovementHandler extends React.Component<MovementHandlerProps> {
    constructor(props: MovementHandlerProps) {
        super(props);

        this.calculateBrightness = this.calculateBrightness.bind(this);
        this.isNewTarget = this.isNewTarget.bind(this);
        this.hasTargetLeft = this.hasTargetLeft.bind(this);
    }

    checkSelection() {
        const selection = this.props.detections.find(detection => {
            return detection.info.type === 'person';
        });

        if (selection) {
            this.isNewTarget();
        } else {
            this.hasTargetLeft();

            if (Math.abs(this.props.target.x) > 1) {
                setTarget({
                    x: 0,
                    y: this.props.target.y,
                });
            }

            const { newX, left } = naturalMovement(
                this.props.target.x,
                this.props.left,
            );

            setTarget({ x: newX, y: 0 });
            setLeft(left);
        }
    }

    calculateBrightness() {
        const { tooBright, scaledPupilSize } = checkLight(
            this.props.tooBright,
            null, // image,
            analyseLight,
        );

        if (tooBright) {
            setBright(true);
            setOpen(eyelidPosition.CLOSED);
        } else if (this.props.tooBright) {
            setBright(false);
            setOpen(eyelidPosition.OPEN);
        }

        setDilation(scaledPupilSize);
    }

    isNewTarget() {
        if (!this.props.personDetected) {
            setDetected(true);
            setTarget({ x: middleX, y: middleY });
            setDilation(pupilSizes.dilated);
            setDilation(pupilSizes.neutral);
        }
    }

    hasTargetLeft() {
        if (this.props.personDetected) {
            setDetected(false);
            setSquinting(true);
            setDilation(pupilSizes.constricted);
            setDilation(pupilSizes.neutral);
            setOpen(eyelidPosition.SQUINT);
        }

        if (this.props.squinting && Math.random() < 0.1) {
            setOpen(eyelidPosition.OPEN);
            setSquinting(false);
        }
    }
}

const mergeStateToProps = (state: IRootStore) => {
    return {
        detections: state.detectionStore.detections,
        target: state.detectionStore.target,
        tooBright: state.detectionStore.tooBright,
        left: state.detectionStore.left,
        squinting: state.detectionStore.isSquinting,
        openCoefficient: state.detectionStore.eyesOpenCoefficient,
        dilationCoefficient: state.detectionStore.dilationCoefficient,
    };
};

const mergeDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
    return {
        setLeft: (left: boolean) => dispatch(setLeft(left)),
        setSquinting: (isSquinting: boolean) =>
            dispatch(setSquinting(isSquinting)),
        setBright: (bright: boolean) => dispatch(setBright(bright)),
        setDilation: (dilation: number) => dispatch(setDilation(dilation)),
        setOpen: (openCoefficient: number) =>
            dispatch(setOpen(openCoefficient)),
        setDetected: (detected: boolean) => dispatch(setDetected(detected)),
        setTarget: (target: ICoords) => dispatch(setTarget(target)),
    };
};

export default connect(
    mergeStateToProps,
    mergeDispatchToProps,
)(MovementHandler);
