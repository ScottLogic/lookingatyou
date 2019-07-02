import {
    eyelidPosition,
    middleX,
    middleY,
    pupilSizes,
} from '../../AppConstants';
import { naturalMovement } from '../../components/eye/EyeUtils';
import { IDetection } from '../../models/objectDetection';
import { Bbox } from '../types';

export default function selectFirst(detections: IDetection[]): Bbox {
    const selection = detections.find(detection => {
        return detection.info.type === 'person';
    });

    if (selection) {
        isNewTarget();
        return selection.bbox;
    } else {
        hasTargetLeft();

        if (Math.abs(this.state.targetX) > 1) {
            this.setState({ targetX: 0 });
        }

        const { newX, left } = naturalMovement(
            this.state.targetX,
            this.state.direction,
        );
        this.setState({
            targetY: 0,
            targetX: newX,
            direction: left,
        });
    }
}

export function isNewTarget() {
    if (!this.state.personDetected) {
        this.setState({
            personDetected: true,
            targetX: middleX,
            targetY: middleY,
        });

        setDilation(pupilSizes.dilated);
        setDilation(pupilSizes.neutral);
    }
}

export function hasTargetLeft() {
    if (this.state.personDetected) {
        this.setState({ personDetected: false, isSquinting: true });
        setDilation(pupilSizes.constricted);
        setDilation(pupilSizes.neutral);
        this.setState({ eyesOpenCoefficient: eyelidPosition.SQUINT });
    }

    if (this.state.isSquinting && Math.random() < 0.1) {
        this.setState({
            eyesOpenCoefficient: eyelidPosition.OPEN,
            isSquinting: false,
        });
    }
}

export function setDilation(pupilSize: number) {
    this.setState(() => ({
        dilationCoefficient: pupilSize,
    }));
}
