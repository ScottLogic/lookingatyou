import React from 'react';
import { eyeCoefficients } from '../../../AppConstants';

export const Sclera = React.memo(() => {
    return (
        <circle
            className={'sclera'}
            r={eyeCoefficients.sclera}
            fill={'url(#scleraGradient)'}
        />
    );
});
